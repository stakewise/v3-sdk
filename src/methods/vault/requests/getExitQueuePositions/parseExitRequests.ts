import vaultMulticall from '../../../../contracts/vaultMulticall'


export type ParseExitRequestsInput = {
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
  options: StakeWise.Options
  duration: number
  userAddress: string
  vaultAddress: string
  exitRequests: Array<{
    positionTicket: string
    totalShares: string
    totalAssets: string
    timestamp: string
  }>
}

type Position = {
  exitQueueIndex: bigint
  positionTicket: string
  isV1Position: boolean
  timestamp: string
}

export type ParseExitRequestsOutput = {
  total: bigint
  duration: number
  withdrawable: bigint
  positions: Position[]
}

type ExitedAssetsResponse = Array<{
  leftTickets: bigint
  exitedTickets: bigint
  exitedAssets: bigint
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
  const { options, contracts, provider, userAddress, vaultAddress, duration, exitRequests } = values

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

  let queuedShares = 0n,
      queuedAssets = 0n

  for (let i = 0; i < indexes.length; i++) {
    const { positionTicket, timestamp, totalShares, totalAssets } = exitRequests[i]

    queuedShares += BigInt(totalShares || 0)
    queuedAssets += BigInt(totalAssets || 0)

    // If the index is -1 then we cannot claim anything. Otherwise, the value is >= 0.
    const exitQueueIndex = indexes[i][0]

    if (exitQueueIndex < 0n) {
      continue
    }

    // 24 hours must have elapsed since the position was created
    const is24HoursPassed = await _checkTimestamp(timestamp, provider)

    if (is24HoursPassed) {
      const isV1Position = BigInt(totalShares) > 0
      const item = { exitQueueIndex, positionTicket, timestamp, isV1Position }

      claims.push(item)
    }
  }

  if (!claims.length) {
    const result = await vaultMulticall<Array<{ assets: bigint }>>({
      ...commonMulticallParams,
      request: {
        params: [ { method: 'convertToAssets', args: [ queuedShares ] } ],
        callStatic: true,
      },
    })
    const totalV1QueuedAssets = result[0]?.assets || 0n

    // If there are no positions with an index greater than 0 or their timestamp has failed the 24-hour check.
    // Then we can use totalShares from the subgraph to show total
    return {
      duration,
      positions: [],
      withdrawable: 0n,
      total: totalV1QueuedAssets + queuedAssets,
    }
  }

  // We need to calculate the exited assets for every position.
  const exitedAssetsResponse = await vaultMulticall<ExitedAssetsResponse>({
      ...commonMulticallParams,
      request: {
        params: claims.map(({ positionTicket, exitQueueIndex, timestamp }) => ({
          method: 'calculateExitedAssets',
          args: [ userAddress, positionTicket, timestamp, exitQueueIndex ],
        })),
        callStatic: true,
      },
    }) || []

  // Calculate total withdrawable assets
  let withdrawableAssets = 0n

  exitedAssetsResponse.forEach(({ exitedTickets, exitedAssets }, i) => {
    const { isV1Position } = claims[i]

    if (isV1Position) {
      // in V1 exit queue exit tickets are shares
      queuedShares -= BigInt(exitedTickets || 0)
    }
    else {
      queuedAssets -= BigInt(exitedAssets || 0)
    }

    withdrawableAssets += BigInt(exitedAssets || 0)
  })

  if (queuedShares > 0) {
    const result = await vaultMulticall<Array<{ assets: bigint }>>({
      ...commonMulticallParams,
      request: {
        params: [ { method: 'convertToAssets', args: [ queuedShares ] } ],
        callStatic: true,
      },
    })

    queuedAssets += result[0]?.assets || 0n
  }

  const total = withdrawableAssets + queuedAssets

  return {
    total,
    duration,
    positions: claims,
    withdrawable: withdrawableAssets,
  }
}


export default parseExitRequests
