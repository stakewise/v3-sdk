import { BoostQueuePositionsQueryPayload } from '../../../../graphql/subgraph/boost'


type BoostQueueItem = BoostQueuePositionsQueryPayload['leverageStrategyPositions'][number]
type ExitRequest = NonNullable<BoostQueueItem['exitRequest']>
export type ClaimPosition = Pick<ExitRequest, 'positionTicket' | 'timestamp' | 'exitQueueIndex'>

export type ParseBoostQueueInput = {
  leverageStrategyPositions: BoostQueueItem[]
}

export type ParseBoostQueueOutput = {
  isClaimable: boolean
  exitingShares: bigint
  exitingAssets: bigint
  duration: number | null
  position: ClaimPosition | null
}

const modifyQueuePosition = (values: BoostQueuePositionsQueryPayload): ParseBoostQueueOutput => {
  const { leverageStrategyPositions } = values

  if (!leverageStrategyPositions.length || !leverageStrategyPositions[0].exitingPercent) {
    return {
      duration: null,
      position: null,
      exitingShares: 0n,
      exitingAssets: 0n,
      isClaimable: false,
    }
  }

  const { exitingOsTokenShares, exitingAssets, exitRequest } = leverageStrategyPositions[0]

  const output: ParseBoostQueueOutput = {
    duration: null,
    position: null,
    isClaimable: false,
    exitingAssets: BigInt(exitingAssets || 0),
    exitingShares: BigInt(exitingOsTokenShares || 0),
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
