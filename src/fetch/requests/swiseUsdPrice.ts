import { Network } from 'helpers'
import { backend } from 'graphql'


type SwiseUsdPriceInput = {
  network: Network
}

const swiseUsdPrice = async (input: SwiseUsdPriceInput) => {
  const { network } = input

  const data = await backend.swise.fetchSwiseStatsQuery({ network })

  return data?.swiseStats?.price
}


export default swiseUsdPrice
