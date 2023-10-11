import { backend } from '../../graphql'
import { apiUrls } from '../../utils'


type GetSwiseUsdPriceInput = {
  options: StakeWise.Options
}

const getSwiseUsdPrice = async (input: GetSwiseUsdPriceInput) => {
  const { options } = input

  const data = await backend.swise.fetchSwiseStatsQuery({
    url: apiUrls.getBackendUrl(options),
  })

  return data?.swiseStats?.price || '0'
}


export default getSwiseUsdPrice
