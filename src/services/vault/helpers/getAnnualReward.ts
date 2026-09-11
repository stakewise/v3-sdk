import { BigDecimal } from '../../../helpers'


const getAnnualReward = (principal: bigint, apy: number): bigint => {
  if (principal <= 0n || !apy) {
    return 0n
  }

  return BigInt(
    new BigDecimal(apy)
      .divide(100)
      .multiply(principal)
      .decimals(0)
      .toString()
  )
}


export default getAnnualReward
