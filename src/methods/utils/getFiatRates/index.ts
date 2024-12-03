import graphql from '../../../graphql'
import { apiUrls, configs, Network } from '../../../utils'


type GetFiatRatesInput = {
  options: StakeWise.Options
}

const getGnoRate = () => graphql.subgraph.stats.fetchFiatRatesQuery({
  url: configs[Network.Gnosis].api.subgraph,
  modifyResult: (data) => Number(data.networks[0].assetsUsdRate),
})

const getFiatRates = (values: GetFiatRatesInput) => {
  const { options } = values

  return graphql.subgraph.stats.fetchFiatRatesQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    modifyResult: async (data) => {
      const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(options.network)

      let assetUsd = Number(data.networks[0].assetsUsdRate)

      if (isGnosis) {
        assetUsd = await getGnoRate()
      }

      return {
        'ASSET/USD': assetUsd,
        'USD/EUR': Number(data.networks[0].usdToEurRate),
        'USD/GBP': Number(data.networks[0].usdToGbpRate),
        'SWISE/USD': Number(data.networks[0].swiseUsdRate),
      }
    },
  })
}


export default getFiatRates
