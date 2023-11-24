import vaultMulticall from '../../../../contracts/vaultMulticall'


export type ParseExitRequestsInput = {
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
  options: StakeWise.Options
  userAddress: string
  vaultAddress: string
  totalShares: bigint
  exitRequests: Array<{
    positionTicket: string
    totalShares: string
    timestamp: string
  }>
}

type Position = {
  exitQueueIndex: bigint
  positionTicket: string
  timestamp: string
}

type ParseExitRequestsOutput = {
  total: bigint
  withdrawable: bigint
  positions: Position[]
}

type ExitedAssetsResponse = Array<{
  newPositionTicket: bigint,
  claimedShares: bigint,
  claimedAssets: bigint
}>

const _checkTimestamp = async (timestamp: string, provider: StakeWise.Provider) => {
  const lastBlock = await provider.getBlock('latest')

  const current = lastBlock
    ? lastBlock.timestamp
    : Number((new Date().getTime() / 1000).toFixed(0))

  const diff = Number(current) - Number(timestamp)

  return diff > 86_400 // 24 hours
}

const parseExitRequests = async (values: ParseExitRequestsInput): Promise<ParseExitRequestsOutput> => {
  const { options, contracts, provider, userAddress, vaultAddress, totalShares, exitRequests } = values

  const keeperContract = contracts.base.keeper
  const vaultContract = contracts.helpers.createVault(vaultAddress)

  const commonMulticallParams = {
    options,
    userAddress,
    vaultAddress,
    vaultContract,
    keeperContract,
  }

  // We must fetch the exit queue index for every position.
  // Based on the response we can determine if we can claim exited assets.
  const indexesResponse = await vaultMulticall<Array<bigint[]>>({
    ...commonMulticallParams,
    request: {
      params: exitRequests.map(({ positionTicket }) => ({
        method: 'getExitQueueIndex',
        args: [ positionTicket ],
      })),
      callStatic: true,
    },
  })

  const claims: Position[] = []
  const indexes = (indexesResponse || [])

  for (let i = 0; i < indexes.length; i++) {
    const exitQueueIndex = indexes[i][0]
    const { positionTicket, timestamp } = exitRequests[i]

    // 24 hours must have elapsed since the position was created
    const is24HoursPassed = await _checkTimestamp(timestamp, provider)

    // If the index is -1 then we cannot claim anything. Otherwise, the value is >= 0.
    const isValid = exitQueueIndex > -1n

    if (isValid && is24HoursPassed) {
      const item = { exitQueueIndex, positionTicket, timestamp }

      claims.push(item)
    }
  }

  let exitedAssetsResponse: ExitedAssetsResponse = []

  if (claims.length) {
    // We need to get the data of the contract after the claim.
    exitedAssetsResponse = await vaultMulticall<ExitedAssetsResponse>({
      ...commonMulticallParams,
      request: {
        params: claims.map(({ positionTicket, exitQueueIndex, timestamp }) => ({
          method: 'claimExitedAssets',
          args: [ positionTicket, timestamp, exitQueueIndex ],
        })),
        callStatic: true,
      },
    }) || []
  }

  let remainingShares = totalShares,
      totalExitingAssets = 0n,
      withdrawableAssets = 0n

  exitedAssetsResponse.forEach(({ newPositionTicket, claimedShares, claimedAssets }, index) => {
    // "claimedAssets" is the value in ETH that user will take after claim.
    // We can get the sum of these values to display how much ETH the user will get

    withdrawableAssets = withdrawableAssets + claimedAssets

    const prevPositionTicket = claims[index].positionTicket
    const item = exitRequests.find((item) => item.positionTicket === prevPositionTicket)

    // Check whether not all the shares have been exited
    if (newPositionTicket > 0) {
      // Subtract claimed shares from the remaining shares
      remainingShares = remainingShares - claimedShares
    }
    else {
      // If the next position ID is 0, then we will take all tokens from it
      remainingShares = remainingShares - BigInt(item?.totalShares || 0)
    }
  })

  if (remainingShares > 0) {
    // If there are remaining shares, we must calculate how many assets are still queuing
    // Remember - Shares are VLT tokens and Assets are ETH tokens
    const remainingAssets = await vaultMulticall<Array<{ assets: bigint }>>({
      ...commonMulticallParams,
      request: {
        params: [ { method: 'convertToAssets', args: [ remainingShares ] } ],
        callStatic: true,
      },
    })

    totalExitingAssets = remainingAssets[0]?.assets || 0n
  }

  return {
    positions: claims,
    total: totalExitingAssets,
    withdrawable: withdrawableAssets,
  }
}


export default parseExitRequests
