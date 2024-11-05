import { BoostQueuePositionsQueryPayload } from '../../../../graphql/subgraph/boost'


type BoostQueueItem = BoostQueuePositionsQueryPayload['leverageStrategyPositions'][number]

type ClaimPosition = Pick<BoostQueueItem['exitRequest'], 'positionTicket' | 'timestamp' | 'exitQueueIndex'>

export type ParseBoostQueueInput = {
  leverageStrategyPositions: BoostQueueItem[]
}

export type ParseBoostQueueOutput = {
  totalShares: bigint
  totalAssets: bigint
  isClaimable: boolean
  duration: number | null
  position: ClaimPosition | null
}

const modifyQueuePosition = (values: BoostQueuePositionsQueryPayload): ParseBoostQueueOutput => {
  const { leverageStrategyPositions } = values

  if (!leverageStrategyPositions.length || !leverageStrategyPositions[0].exitingPercent) {
    return {
      duration: null,
      position: null,
      totalShares: 0n,
      totalAssets: 0n,
      isClaimable: false,
    }
  }

  const { exitingOsTokenShares, exitingAssets, exitRequest } = leverageStrategyPositions[0]

  const output: ParseBoostQueueOutput = {
    duration: null,
    position: null,
    isClaimable: false,
    totalAssets: BigInt(exitingAssets),
    totalShares: BigInt(exitingOsTokenShares),
  }

  if (exitRequest) {
    const {
      timestamp,
      totalAssets,
      isClaimable,
      exitedAssets,
      positionTicket,
      exitQueueIndex,
      withdrawalTimestamp,
    } = exitRequest

    output.position = {
      timestamp,
      positionTicket,
      exitQueueIndex,
    }

    output.isClaimable = isClaimable && (exitedAssets === totalAssets)
    output.duration = withdrawalTimestamp ? Number(withdrawalTimestamp) : null
  }

  return output
}


export default modifyQueuePosition
