import { apiUrls } from '../../../utils'
import graphql from '../../../graphql'


type GetSwiseUsdPriceInput = {
  options: StakeWise.Options
}

const getSwiseUsdPrice = (input: GetSwiseUsdPriceInput) => {
  const { options } = input

  return graphql.backend.swise.fetchSwiseStatsQuery({
    url: apiUrls.getBackendUrl(options),
    modifyResult: (data) => data?.swiseStats?.price || '0',
  })
}


export default getSwiseUsdPrice
