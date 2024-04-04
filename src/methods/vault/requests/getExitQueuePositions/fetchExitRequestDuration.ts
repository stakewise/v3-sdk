import graphql from '../../../../graphql'
import { apiUrls } from '../../../../utils'


export type FetchExitQueuePositionsInput = {
  options: StakeWise.Options
  vaultAddress: string
  userAddress: string
}

const fetchExitRequestDuration = (values: FetchExitQueuePositionsInput) => {
  const { options, vaultAddress, userAddress } = values

  return graphql.backend.vault.fetchExitRequestsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vault: vaultAddress.toLowerCase(),
      user: userAddress.toLowerCase(),
    },
    modifyResult: (data) => {
      if (!data || !data.exitRequests || !data.exitRequests.length) {
        return 0
      }

      const durations = data.exitRequests.map(request => request.duration)

      return Math.max(...durations)
    },
  })
}


export default fetchExitRequestDuration
