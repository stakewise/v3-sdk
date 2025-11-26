import graphql from '../../../graphql'
import { configs, Network } from '../../../utils'


const getGnoRate = () => graphql.subgraph.stats.fetchFiatRatesQuery({
  url: configs[Network.Gnosis].api.subgraph,
  modifyResult: (data) => Number(data.exchangeRates[0].assetsUsdRate),
})

export const getFiatRates = (values: StakeWise.CommonParams) => {
  const { options } = values

  return graphql.subgraph.stats.fetchFiatRatesQuery({
    url: configs[Network.Mainnet].api.subgraph,
    modifyResult: async (data) => {
      const {
        osTokenAssetsRate,
        assetsUsdRate,
        usdToEurRate,
        usdToGbpRate,
        usdToCnyRate,
        usdToJpyRate,
        usdToKrwRate,
        usdToAudRate,
        swiseUsdRate,
        obolUsdRate,
        ssvUsdRate,
      } = data.exchangeRates[0]

      let assetUsd = Number(assetsUsdRate)

      const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(options.network)

      if (isGnosis) {
        assetUsd = await getGnoRate()
      }

      return {
        // Fiat
        'USD/EUR': Number(usdToEurRate),
        'USD/GBP': Number(usdToGbpRate),
        'USD/CNY': Number(usdToCnyRate),
        'USD/JPY': Number(usdToJpyRate),
        'USD/KRW': Number(usdToKrwRate),
        'USD/AUD': Number(usdToAudRate),

        // Tokens
        'ASSET/USD': assetUsd,
        'SSV/USD': Number(ssvUsdRate),
        'OBOL/USD': Number(obolUsdRate),
        'SWISE/USD': Number(swiseUsdRate),
        'osToken/USD': Number(osTokenAssetsRate) * assetUsd,
      }
    },
  })
}
