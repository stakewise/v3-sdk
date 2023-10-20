import { backend } from '../../graphql'
import { apiUrls } from '../../utils'


type GetSwiseUsdPriceInput = {
  options: StakeWise.Options
}

const getSwiseUsdPrice = async (input: GetSwiseUsdPriceInput) => {
  const { options } = input

  const data = await backend.swise.fetchSwiseStatsQuery({
    // TODO remove when mainnet backend will be ready
    url: 'https://testnet-api.stakewise.io/graphql',
    // url: apiUrls.getBackendUrl(options),
  })

  return data?.swiseStats?.price || '0'
}


export default getSwiseUsdPrice
