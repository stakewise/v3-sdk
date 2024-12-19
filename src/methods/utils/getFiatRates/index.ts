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
    url: configs[Network.Mainnet].api.subgraph,
    modifyResult: async (data) => {
      const { assetsUsdRate, usdToGbpRate, usdToEurRate, swiseUsdRate } = data.networks[0]

      let assetUsd = Number(assetsUsdRate)

      const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(options.network)

      if (isGnosis) {
        assetUsd = await getGnoRate()
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
