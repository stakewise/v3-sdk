import { ExitQueueQueryPayload } from '../../../../graphql/subgraph/exitQueue'


type ExitRequest = ExitQueueQueryPayload['exitRequests'][number]

type OutputExitRequest = Omit<
  ExitQueueQueryPayload['exitRequests'][number],
  'withdrawalTimestamp' | 'totalAssets' | 'exitedAssets'
> & {
  withdrawalTimestamp: string | null
  exitedAssets: bigint
  totalAssets: bigint
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
  duration: number | null
  requests: OutputExitRequest[]
}

const modifyExitRequests = async (values: ParseExitRequestsInput): Promise<ParseExitRequestsOutput> => {
  const { exitRequests } = values

  if (!exitRequests.length) {
    return {
      total: 0n,
      duration: 0,
      requests: [],
      positions: [],
      withdrawable: 0n,
    }
  }

  let total = 0n
  let withdrawable = 0n
  let duration: null | number = 0

  const positions: Position[] = []
  const requests: OutputExitRequest[] = []

  exitRequests.forEach((exitRequest) => {
    const {
      timestamp,
      totalAssets,
      isClaimable,
      exitedAssets,
      exitQueueIndex,
      positionTicket,
    } = exitRequest

    const totalAssetsBN = BigInt(totalAssets || 0)
    const exitedAssetsBN = BigInt(exitedAssets || 0)

    total += totalAssetsBN

    if (isClaimable) {
      withdrawable += exitedAssetsBN

      positions.push({
        timestamp,
        positionTicket,
        exitQueueIndex: exitQueueIndex as string,
      })
    }

    requests.push({
      ...exitRequest,
      totalAssets: totalAssetsBN,
      exitedAssets: exitedAssetsBN,
    })

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
    requests,
    duration,
    positions,
    withdrawable,
  }
}


export default modifyExitRequests
