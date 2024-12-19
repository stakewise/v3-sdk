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

  const assetUsdPromise = options.network === Network.Chiado
    ? getGnoRate()
    : Promise.resolve(0)

  return graphql.subgraph.stats.fetchFiatRatesQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    modifyResult: async (data) => {
      const { assetsUsdRate, usdToGbpRate, usdToEurRate, swiseUsdRate } = data.networks[0]

      let assetUsd = Number(assetsUsdRate)

      if (options.network === Network.Chiado) {
        assetUsd = await assetUsdPromise
      }

      return {
        'ASSET/USD': assetUsd,
        'USD/EUR': Number(usdToEurRate),
        'USD/GBP': Number(usdToGbpRate),
        'SWISE/USD': Number(swiseUsdRate),
      }
    },
  })
}


export default getFiatRates
