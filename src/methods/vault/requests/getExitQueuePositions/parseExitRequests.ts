import vaultMulticall from '../../../../contracts/vaultMulticall'


export type ParseExitRequestsInput = {
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
  options: StakeWise.Options
  userAddress: string
  totalShares: bigint
  vaultAddress: string
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
  leftShares: bigint
  claimedShares: bigint
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
          method: 'calculateExitedAssets',
          args: [ userAddress, positionTicket, timestamp, exitQueueIndex ],
        })),
        callStatic: true,
      },
    }) || []
  }
  else {
    const result = await vaultMulticall<Array<{ assets: bigint }>>({
      ...commonMulticallParams,
      request: {
        params: [ { method: 'convertToAssets', args: [ totalShares ] } ],
        callStatic: true,
      },
    })

    // If there are no positions with an index greater than 0 or their timestamp has failed the 24 hour check.
    // Then we can use totalShares from the subgraph to show total
    return {
      positions: [],
      withdrawable: 0n,
      total: result[0]?.assets || 0n,
    }
  }

  let withdrawableAssets = 0n,
      totalLeftShares = 0n,
      totalLeftAssets = 0n

  exitedAssetsResponse.forEach(({ leftShares, claimedAssets }) => {
    totalLeftShares += leftShares
    withdrawableAssets += claimedAssets
  })

  if (totalLeftShares > 0) {
    const result = await vaultMulticall<Array<{ assets: bigint }>>({
      ...commonMulticallParams,
      request: {
        params: [ { method: 'convertToAssets', args: [ totalLeftShares ] } ],
        callStatic: true,
      },
    })

    totalLeftAssets = result[0]?.assets || 0n
  }

  const total = withdrawableAssets + totalLeftAssets

  return {
    total,
    positions: claims,
    withdrawable: withdrawableAssets,
  }
}


export default parseExitRequests
