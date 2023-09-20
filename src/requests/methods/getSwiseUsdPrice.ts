import { backend } from 'graphql'


type GetSwiseUsdPriceInput = {
  options: SDK.Options
}

const getSwiseUsdPrice = async (input: GetSwiseUsdPriceInput) => {
  const { options } = input

  const data = await backend.swise.fetchSwiseStatsQuery({ network: options.network })

  return data?.swiseStats?.price
}


export default getSwiseUsdPrice
