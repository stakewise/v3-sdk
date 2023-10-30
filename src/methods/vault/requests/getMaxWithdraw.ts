import { parseEther } from 'ethers'

import { BigDecimal, constants } from '../../../utils'


type GetMaxWithdrawInput = {
  ltvPercent: bigint
  mintedAssets: bigint
  stakedAssets: bigint
  contracts: StakeWise.Contracts
}

const getMaxWithdraw = async (values: GetMaxWithdrawInput) => {
  const { contracts, mintedAssets, stakedAssets, ltvPercent } = values

  if (ltvPercent <= 0) {
    return 0n
  }

  const rewardPerSecond = await contracts.tokens.mintToken.avgRewardPerSecond()

  const gap = new BigDecimal(rewardPerSecond)
    .multiply(60 * 60) // 1h
    .multiply(mintedAssets)
    .divide(constants.blockchain.amount1)
    .toString()

  const lockedAssets = new BigDecimal(mintedAssets)
    .plus(gap)
    .multiply(10_000)
    .divide(ltvPercent)
    .toString()

  const maxWithdrawAssets = new BigDecimal(stakedAssets)
    .minus(lockedAssets)
    .divide(constants.blockchain.amount1)
    .decimals(18)

  return maxWithdrawAssets.gt(0)
    ? parseEther(maxWithdrawAssets.toString())
    : 0n
}


export default getMaxWithdraw
