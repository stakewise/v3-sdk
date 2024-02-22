import { parseEther } from 'ethers'

import { constants } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


type GetMaxWithdrawInput = {
  ltvPercent: bigint
  mintedAssets: bigint
  stakedAssets: bigint
  contracts: StakeWise.Contracts
}

const min = parseEther('0.00001')

const getMaxWithdraw = async (values: GetMaxWithdrawInput) => {
  const { contracts, mintedAssets, stakedAssets, ltvPercent } = values

  if (ltvPercent <= 0 || stakedAssets < min) {
    return 0n
  }

  const rewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const secondsInHour = 60n * 60n
  const gap = rewardPerSecond * secondsInHour * mintedAssets / constants.blockchain.amount1
  const lockedAssets = (mintedAssets + gap) * 10_000n / ltvPercent
  const maxWithdrawAssets = stakedAssets - lockedAssets

  return maxWithdrawAssets > min ? maxWithdrawAssets : 0n
}


export default wrapAbortPromise<GetMaxWithdrawInput, bigint>(getMaxWithdraw)
