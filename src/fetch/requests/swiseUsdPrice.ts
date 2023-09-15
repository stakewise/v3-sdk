import { backend } from 'graphql'


const swiseUsdPrice = async () => {
  const data = await backend.swise.fetchSwiseStatsQuery({})

  return data?.swiseStats?.price
}


export default swiseUsdPrice
