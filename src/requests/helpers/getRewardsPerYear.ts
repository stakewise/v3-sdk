import { BigDecimal, constants } from 'helpers'


type GetRewardsPerYearInput = {
  amount: bigint
  averageRewardsPerSecond: bigint
}

const getRewardsPerYear = (values: GetRewardsPerYearInput) => {
  const { amount, averageRewardsPerSecond } = values

  const rewards = new BigDecimal(averageRewardsPerSecond)
    .multiply(constants.blockchain.secondsInYear)
    .multiply(amount)
    .divide(constants.blockchain.amount1)
    .decimals(18)
    .toString()

  return rewards
}


export default getRewardsPerYear
