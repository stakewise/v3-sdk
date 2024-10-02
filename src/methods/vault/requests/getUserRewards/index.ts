import type { UserRewardsQueryVariables } from '../../../../graphql/subgraph/vault'
import { apiUrls, Network, validateArgs, configs } from '../../../../utils'
import modifyUserRewards from './modifyUserRewards'
import graphql from '../../../../graphql'
import type { ModifyUserRewards, GbpRate } from './types'


type GetUserRewardsInput = {
  dateTo?: number
  dateFrom: number
  options: StakeWise.Options
  userAddress: UserRewardsQueryVariables['user']
  vaultAddress: UserRewardsQueryVariables['vaultAddress']
}

const getMainnetGbpRate = (input: GetUserRewardsInput) => {
  const { dateFrom, dateTo, userAddress, vaultAddress } = input

  return graphql.subgraph.vault.fetchUserRewardsQuery({
    url: configs[Network.Mainnet].api.subgraph,
    variables: {
      dateTo: String(dateTo),
      dateFrom: String(dateFrom),
      user: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    } as UserRewardsQueryVariables,
    modifyResult: (data) : GbpRate[] => {
      return data.exchangeRate.map(({ usdToGbpRate }) => ({ usdToGbpRate }))
    },
  })
}

const getUserRewards = async (input: GetUserRewardsInput) => {
  const { options, vaultAddress, userAddress, dateFrom, dateTo } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ dateFrom })

  if (dateTo) {
    validateArgs.number({ dateTo })
  }

  const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(options.network)
  const mainnetGbpRates = isGnosis ? await getMainnetGbpRate(input) : []

  return graphql.subgraph.vault.fetchUserRewardsQuery<ModifyUserRewards[]>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      dateTo: String(dateTo),
      dateFrom: String(dateFrom),
      user: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    } as UserRewardsQueryVariables,
    modifyResult: modifyUserRewards(mainnetGbpRates),
  })
}


export default getUserRewards
