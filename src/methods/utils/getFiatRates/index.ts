import graphql from '../../../graphql'
import { apiUrls, configs, Network } from '../../../utils'


type GetFiatRatesInput = {
  options: StakeWise.Options
}

const getMainnetGbpRate = () => {
  return graphql.subgraph.stats.fetchFiatRatesQuery({
    url: configs[Network.Mainnet].api.subgraph,
    modifyResult: (data): number => {
      const usdInGbp = Number(data.networks[0].usdToGbpRate)

      return usdInGbp
    },
  })
}

const getFiatRates = (values: GetFiatRatesInput) => {
  const { options } = values

  return graphql.subgraph.stats.fetchFiatRatesQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    modifyResult: async (data) => {
      const usd = Number(data.networks[0].assetsUsdRate)
      const usdInEur = Number(data.networks[0].usdToEurRate)

      const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(options.network)
      const usdInGbp = isGnosis ? await getMainnetGbpRate() : Number(data.networks[0].usdToGbpRate)

      return {
        assetsUsdRate: usd,
        usdToEurRate: usdInEur,
        usdToGbpRate: usdInGbp,
      }
    },
  })
}


export default getFiatRates
