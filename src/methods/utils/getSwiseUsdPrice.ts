import { apiUrls } from '../../utils'
import graphql from '../../graphql'


type GetSwiseUsdPriceInput = {
  options: StakeWise.Options
}

const getSwiseUsdPrice = async (input: GetSwiseUsdPriceInput) => {
  const { options } = input

  const data = await graphql.backend.swise.fetchSwiseStatsQuery({
    url: apiUrls.getBackendUrl(options),
  })

  return data?.swiseStats?.price || '0'
}


export default getSwiseUsdPrice
