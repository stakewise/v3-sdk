import { apiUrls } from 'helpers'
import { backend } from 'graphql'


type GetSwiseUsdPriceInput = {
  options: StakeWise.Options
}

const getSwiseUsdPrice = async (input: GetSwiseUsdPriceInput) => {
  const { options } = input

  const data = await backend.swise.fetchSwiseStatsQuery({
    url: apiUrls.getBackendUrl(options),
  })

  return data?.swiseStats?.price
}


export default getSwiseUsdPrice
