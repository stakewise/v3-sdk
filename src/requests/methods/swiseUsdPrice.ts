import { backend } from 'graphql'


type SwiseUsdPriceInput = {
  options: SDK.Options
}

const swiseUsdPrice = async (input: SwiseUsdPriceInput) => {
  const { options } = input

  const data = await backend.swise.fetchSwiseStatsQuery({ network: options.network })

  return data?.swiseStats?.price
}


export default swiseUsdPrice
