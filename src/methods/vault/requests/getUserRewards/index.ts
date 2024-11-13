import type { UserRewardsQueryVariables } from '../../../../graphql/subgraph/vault'
import { apiUrls, Network, validateArgs } from '../../../../utils'
import modifyUserRewards from './modifyUserRewards'
import type { ModifyUserRewards } from './types'
import getMainnetRates from './getMainnetRates'
import graphql from '../../../../graphql'


type GetUserRewardsInput = {
  dateTo: number
  dateFrom: number
  options: StakeWise.Options
  userAddress: UserRewardsQueryVariables['user']
  vaultAddress: UserRewardsQueryVariables['vaultAddress']
}

const getUserRewards = async (input: GetUserRewardsInput) => {
  const { options, vaultAddress, userAddress, dateFrom, dateTo } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ dateFrom, dateTo })

  const isGnosis = [
    Network.Gnosis,
    Network.Chiado,
  ].includes(options.network)

  let mainnetRates

  if (isGnosis) {
    // We can't fetch GPB rates from gnosis subgraph
    mainnetRates = await getMainnetRates(input)
  }

  return graphql.subgraph.vault.fetchUserRewardsQuery<ModifyUserRewards[]>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      includeExchangeRate: !isGnosis,
      dateTo: String(dateTo * 1_000),
      user: userAddress.toLowerCase(),
      dateFrom: String(dateFrom * 1_000),
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: modifyUserRewards(mainnetRates),
  })
}


export default getUserRewards
