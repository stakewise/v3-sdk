import { vaultMulticall } from 'contracts'


export type ParseExitRequestsInput = {
  options: SDK.Options
  contracts: SDK.Contracts
  userAddress: string
  vaultAddress: string
  totalShares: bigint
  exitRequests: Array<{
    positionTicket: string
    totalShares: string
  }>
}

type Position = {
  exitQueueIndex: bigint
  positionTicket: string
}

type ParseExitRequestsOutput = {
  total: bigint
  data: Position[]
  withdrawable: bigint
}

const parseExitRequests = async (values: ParseExitRequestsInput): Promise<ParseExitRequestsOutput> => {
  const { options, contracts, userAddress, vaultAddress, totalShares, exitRequests } = values

  const keeperContract = contracts.base.keeper
  const vaultContract = contracts.helpers.createVaultContract(vaultAddress)

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
      updateState: true,
      callStatic: true,
    },
  })

  // We need to make a list with ID and Index for those items from which you can get VLT tokens
  const claims = (indexesResponse || []).reduce((acc, result, index) => {
    const exitQueueIndex = result[0]
    const positionTicket = exitRequests[index].positionTicket

    // If the index is -1 then we cannot claim anything. Otherwise, the value is >= 0.
    if (exitQueueIndex > -1n) {
      const item = { exitQueueIndex, positionTicket }

      return [ ...acc, item ]
    }

    return acc
  }, [] as Position[])

  // We need to get the data of the contract after the claim.
  const exitedAssetsResponse = await vaultMulticall<Array<{
    newPositionTicket: bigint,
    claimedShares: bigint,
    claimedAssets: bigint
  }>>({
    ...commonMulticallParams,
    request: {
      params: claims.map(({ positionTicket, exitQueueIndex }) => ({
        method: 'claimExitedAssets',
        args: [ positionTicket, exitQueueIndex ],
      })),
      updateState: true,
      callStatic: true,
    },
  }) || []

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
        updateState: true,
        callStatic: true,
      },
    })

    totalExitingAssets = remainingAssets[0]?.assets
  }

  return {
    data: claims,
    total: totalExitingAssets,
    withdrawable: withdrawableAssets,
  }
}


export default parseExitRequests
