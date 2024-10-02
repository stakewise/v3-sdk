import type { UserExchangeRewardsQueryVariables } from '../../../../graphql/subgraph/vault'
import { apiUrls, Network, validateArgs, configs } from '../../../../utils'
import modifyUserExchangeRewards from './modifyUserExchangeRewards'
import graphql from '../../../../graphql'
import type { ModifyUserExchangeRewards, GbpRate } from './types'


type GetUserExchangeRewardsInput = {
  dateTo?: number
  dateFrom: number
  options: StakeWise.Options
  userAddress: UserExchangeRewardsQueryVariables['user']
  vaultAddress: UserExchangeRewardsQueryVariables['vaultAddress']
}

const getMainnetGbpRate = (input: GetUserExchangeRewardsInput) => {
  const { dateFrom, dateTo, userAddress, vaultAddress } = input

  return graphql.subgraph.vault.fetchUserExchangeRewardsQuery({
    url: configs[Network.Mainnet].api.subgraph,
    variables: {
      dateTo: String(dateTo),
      dateFrom: String(dateFrom),
      user: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    } as UserExchangeRewardsQueryVariables,
    modifyResult: (data) : GbpRate[] => {
      return data.exchangeRate.map(({ usdToGbpRate }) => ({ usdToGbpRate }))
    },
  })
}

const getUserExchangeRewards = async (input: GetUserExchangeRewardsInput) => {
  const { options, vaultAddress, userAddress, dateFrom, dateTo } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ dateFrom })

  if (dateTo) {
    validateArgs.number({ dateTo })
  }

  const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(options.network)
  const mainnetGbpRates = isGnosis ? await getMainnetGbpRate(input) : []

  return graphql.subgraph.vault.fetchUserExchangeRewardsQuery<ModifyUserExchangeRewards[]>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      dateTo: String(dateTo),
      dateFrom: String(dateFrom),
      user: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    } as UserExchangeRewardsQueryVariables,
    modifyResult: modifyUserExchangeRewards(mainnetGbpRates),
  })
}


export default getUserExchangeRewards
