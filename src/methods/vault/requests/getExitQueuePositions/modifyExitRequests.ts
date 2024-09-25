import { ExitQueueQueryPayload } from 'graphql/subgraph/exitQueue'


type ExitRequest = Omit<ExitQueueQueryPayload['exitRequests'][number], 'withdrawalTimestamp'> & {
  withdrawalTimestamp: string | null
}

export type ParseExitRequestsInput = {
  exitRequests: ExitRequest[]
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

const modifyExitRequests = async (values: ParseExitRequestsInput): Promise<ParseExitRequestsOutput> => {
  const { exitRequests } = values

  if (!exitRequests.length) {
    return {
      total: 0n,
      duration: 0,
      pending: [],
      positions: [],
      withdrawable: 0n,
    }
  }

  const isCalculating = exitRequests.some((item) => item.withdrawalTimestamp === null)

  let total = 0n
  let withdrawable = 0n
  let duration: null | number = isCalculating ? null : 0

  const positions: Position[] = []
  const pending: ExitRequest[] = []

  exitRequests.forEach((exitRequest) => {
    const {
      timestamp,
      totalAssets,
      isClaimable,
      isV2Position,
      exitQueueIndex,
      positionTicket,
    } = exitRequest

    const totalAssetsBI = BigInt(totalAssets || 0)

    total += totalAssetsBI

    if (isClaimable) {
      withdrawable += totalAssetsBI

      positions.push({
        timestamp,
        isV2Position,
        positionTicket,
        exitQueueIndex: BigInt(exitQueueIndex),
      })
    }
    else {
      pending.push(exitRequest)
    }

    if (duration !== null) {
      if (exitRequest.withdrawalTimestamp === null) {
        duration = null
      }
      else {
        const withdrawalTimestamp = Number(exitRequest.withdrawalTimestamp)

        if (withdrawalTimestamp > duration) {
          duration = withdrawalTimestamp
        }
      }
    }
  })

  return {
    total,
    pending,
    duration,
    positions,
    withdrawable,
  }
}


export default modifyExitRequests
