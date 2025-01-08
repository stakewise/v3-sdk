import { ExitQueueQueryPayload } from '../../../../graphql/subgraph/exitQueue'


type ExitRequest = Omit<ExitQueueQueryPayload['exitRequests'][number], 'withdrawalTimestamp'> & {
  withdrawalTimestamp: string | null
}

export type ParseExitRequestsInput = {
  exitRequests: ExitRequest[]
}

type Position = {
  exitQueueIndex: string
  positionTicket: string
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

  let total = 0n
  let withdrawable = 0n
  let duration: null | number = 0

  const positions: Position[] = []
  const pending: ExitRequest[] = []

  exitRequests.forEach((exitRequest, index) => {
    const {
      timestamp,
      totalAssets,
      isClaimable,
      exitedAssets,
      exitQueueIndex,
      positionTicket,
    } = exitRequest

    total += BigInt(totalAssets || 0)

    if (isClaimable) {
      withdrawable += BigInt(exitedAssets || 0)

      positions.push({
        timestamp,
        positionTicket,
        exitQueueIndex: exitQueueIndex as string,
      })
    }
    else {
      pending.push(exitRequest)
    }

    if (exitRequest.withdrawalTimestamp === null) {
      duration = null
    }
    else if (duration !== null) {
      const withdrawalTimestamp = Number(exitRequest.withdrawalTimestamp)

      if (withdrawalTimestamp > duration) {
        duration = withdrawalTimestamp
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
