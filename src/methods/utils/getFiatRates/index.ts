import graphql from '../../../graphql'
import { configs, Network } from '../../../utils'


type GetFiatRatesInput = {
  options: StakeWise.Options
}

const getGnoRate = () => graphql.subgraph.stats.fetchFiatRatesQuery({
  url: configs[Network.Gnosis].api.subgraph,
  modifyResult: (data) => Number(data.networks[0].assetsUsdRate),
})

const getFiatRates = (values: GetFiatRatesInput) => {
  const { options } = values

  // TODO uncomment when rates will be deployed to mainnet
  return graphql.subgraph.stats.fetchFiatRatesQuery({
    url: configs[Network.Mainnet].api.subgraph,
    modifyResult: async (data) => {
      const {
        assetsUsdRate,
        usdToEurRate,
        usdToGbpRate,
        // usdToCnyRate,
        // usdToJpyRate,
        // usdToKrwRate,
        // usdToAudRate,
        swiseUsdRate,
      } = data.networks[0]

      let assetUsd = Number(assetsUsdRate)

      const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(options.network)

      if (isGnosis) {
        assetUsd = await getGnoRate()
      }

      return {
        'ASSET/USD': assetUsd,
        'USD/EUR': Number(usdToEurRate),
        'USD/GBP': Number(usdToGbpRate),
        'USD/CNY': 7.3,
        'USD/JPY': 157.21,
        'USD/KRW': 1453.06,
        'USD/AUD': 1.6,
        // 'USD/CNY': Number(usdToCnyRate),
        // 'USD/JPY': Number(usdToJpyRate),
        // 'USD/KRW': Number(usdToKrwRate),
        // 'USD/AUD': Number(usdToAudRate),
        'SWISE/USD': Number(swiseUsdRate),
      }
    },
  })
}


export default getFiatRates
