import vaultMulticall from '../../../../contracts/multicall/vaultMulticall'


type ExitRequest = {
  withdrawalTimestamp: string | null
  positionTicket: string
  isV2Position: boolean
  totalShares: string
  totalAssets: string
  timestamp: string
}

export type ParseExitRequestsInput = {
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
  exitRequests: ExitRequest[]
  options: StakeWise.Options
  userAddress: string
  vaultAddress: string
}

type Position = {
  exitQueueIndex: bigint
  positionTicket: string
  isV2Position: boolean
  timestamp: string
}

export type ParseExitRequestsOutput = {
  total: bigint
  withdrawable: bigint
  positions: Position[]
  pending: ExitRequest[]
  duration: number | null
}

type ExitedAssetsResponse = Array<{
  leftTickets: bigint
  exitedTickets: bigint
  exitedAssets: bigint
}>

const _getDuration = (data: ParseExitRequestsInput['exitRequests']): ParseExitRequestsOutput['duration'] => {
  if (!data || !data.length) {
    return 0
  }

  // which means the exit queue withdrawal time is still being calculated
  const hasNullWithdrawal = data.some((item) => item.withdrawalTimestamp === null)

  if (hasNullWithdrawal) {
    return null
  }

  const durations = data.map((item) => Number(item.withdrawalTimestamp))
  const biggestValue = Math.max(...durations)

  return biggestValue
}

const _checkTimestamp = async (timestamp: string, provider: StakeWise.Provider) => {
  const lastBlock = await provider.getBlock('latest')

  const current = lastBlock
    ? lastBlock.timestamp
    : Number((new Date().getTime() / 1000).toFixed(0))

  const diff = Number(current) - Number(timestamp)

  return diff > 86_400 // 24 hours
}

const parseExitRequests = async (values: ParseExitRequestsInput): Promise<ParseExitRequestsOutput> => {
  const { options, contracts, provider, userAddress, vaultAddress, exitRequests } = values

  if (!exitRequests.length) {
    return {
      total: 0n,
      duration: 0,
      pending: [],
      positions: [],
      withdrawable: 0n,
    }
  }

  const duration = _getDuration(exitRequests)
  const keeperContract = contracts.base.keeper
  const vaultContract = contracts.helpers.createVault({ vaultAddress })

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

  const pending = []
  const claims: Position[] = []
  const indexes = (indexesResponse || [])

  let queuedShares = 0n,
      queuedAssets = 0n

  for (let i = 0; i < indexes.length; i++) {
    const { positionTicket, timestamp, totalShares, totalAssets, isV2Position } = exitRequests[i]

    queuedShares += BigInt(totalShares || 0)
    queuedAssets += BigInt(totalAssets || 0)

    // If the index is -1 then we cannot claim anything. Otherwise, the value is >= 0.
    const exitQueueIndex = indexes[i][0]

    if (exitQueueIndex < 0n) {
      pending.push(exitRequests[i])

      continue
    }

    // 24 hours must have elapsed since the position was created
    const is24HoursPassed = await _checkTimestamp(timestamp, provider)

    if (is24HoursPassed) {
      const item = { exitQueueIndex, positionTicket, timestamp, isV2Position }

      claims.push(item)
    }
    else {
      pending.push(exitRequests[i])
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
      pending,
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
    const { isV2Position } = claims[i]

    if (isV2Position) {
      // in V2 vaults exit queue exit tickets are assets, for v1 and v3+ will be shares
      queuedAssets -= BigInt(exitedAssets || 0)
    }
    else {
      queuedShares -= BigInt(exitedTickets || 0)
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
    pending,
    duration,
    positions: claims,
    withdrawable: withdrawableAssets,
  }
}


export default parseExitRequests
