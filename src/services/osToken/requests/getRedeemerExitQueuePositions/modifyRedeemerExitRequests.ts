import { RedeemerExitQueueQueryPayload } from '../../../../graphql/subgraph/redeemerExitQueue'


type ExitRequest = RedeemerExitQueueQueryPayload['osTokenRedeemerExitRequests'][number]

type OutputExitRequest = Omit<ExitRequest, 'totalShares' | 'totalAssets' | 'exitedAssets'> & {
  totalShares: bigint
  totalAssets: bigint
  exitedAssets: bigint
}

type Position = {
  positionTicket: string
  exitQueueIndex: string
}

export type ParseRedeemerExitRequestsInput = {
  osTokenRedeemerExitRequests: ExitRequest[]
}

export type ParseRedeemerExitRequestsOutput = {
  total: bigint
  withdrawable: bigint
  positions: Position[]
  requests: OutputExitRequest[]
}

const modifyRedeemerExitRequests = (values: ParseRedeemerExitRequestsInput): ParseRedeemerExitRequestsOutput => {
  const { osTokenRedeemerExitRequests } = values

  let total = 0n
  let withdrawable = 0n

  const positions: Position[] = []
  const requests: OutputExitRequest[] = []

  osTokenRedeemerExitRequests.forEach((exitRequest) => {
    const totalShares = BigInt(exitRequest.totalShares || 0)
    const totalAssets = BigInt(exitRequest.totalAssets || 0)
    const exitedAssets = BigInt(exitRequest.exitedAssets || 0)

    total += totalAssets

    if (exitRequest.isClaimable) {
      withdrawable += exitedAssets

      positions.push({
        positionTicket: exitRequest.positionTicket,
        exitQueueIndex: exitRequest.exitQueueIndex as string,
      })
    }

    requests.push({
      ...exitRequest,
      totalShares,
      totalAssets,
      exitedAssets,
    })
  })

  return {
    total,
    requests,
    positions,
    withdrawable,
  }
}


export default modifyRedeemerExitRequests
