import graphql from '../../../graphql'
import { configs, apiUrls, Network } from '../../../helpers'


const getGnoRate = (options: StakeWise.Options) => graphql.subgraph.stats.fetchFiatRatesQuery({
  ...apiUrls.getSubgraphParams(options),
  url: configs[Network.Gnosis].api.subgraph,
  modifyResult: (data) => ({
    assetUsd: Number(data.exchangeRates[0].assetsUsdRate),
    osTokenRate: Number(data.exchangeRates[0].osTokenAssetsRate),
  }),
})

export const getFiatRates = (values: StakeWise.CommonParams) => {
  const { options } = values

  return graphql.subgraph.stats.fetchFiatRatesQuery({
    ...apiUrls.getSubgraphParams(options),
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

      const isGnosis = Network.Gnosis === options.network

      const { assetUsd, osTokenRate } = isGnosis
        ? await getGnoRate(options)
        : { assetUsd: Number(assetsUsdRate), osTokenRate: Number(osTokenAssetsRate) }

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
        'osToken/USD': osTokenRate * assetUsd,
      }
    },
  })
}
