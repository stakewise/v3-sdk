import { BigDecimal, constants, validateArgs } from '../../utils'


type GetRewardsPerYearInput = {
  amount: bigint
  averageRewardsPerSecond: bigint
}

const getRewardsPerYear = (values: GetRewardsPerYearInput) => {
  const { amount, averageRewardsPerSecond } = values

  validateArgs.bigint({ averageRewardsPerSecond })

  const rewards = new BigDecimal(averageRewardsPerSecond)
    .multiply(constants.blockchain.secondsInYear)
    .multiply(amount)
    .divide(constants.blockchain.amount1)
    .decimals(18)
    .toString()

  return rewards
}


export default getRewardsPerYear
