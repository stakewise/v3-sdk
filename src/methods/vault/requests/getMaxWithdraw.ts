import { parseEther } from 'ethers'

import { constants, validateArgs } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


type GetMaxWithdrawInput = {
  ltvPercent: bigint
  mintedAssets: bigint
  stakedAssets: bigint
  vaultAddress: string
  contracts: StakeWise.Contracts
}

const min = parseEther('0.00001')

const getMaxWithdraw = async (values: GetMaxWithdrawInput) => {
  const { contracts, mintedAssets, stakedAssets, ltvPercent, vaultAddress } = values

  validateArgs.address({ vaultAddress })
  validateArgs.bigint({ mintedAssets, stakedAssets, ltvPercent })

  if (!mintedAssets) {
    return stakedAssets
  }

  if (ltvPercent <= 0 || stakedAssets < min) {
    return 0n
  }

  const avgRewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const secondsInHour = 60n * 60n
  const gap = avgRewardPerSecond * secondsInHour * mintedAssets / constants.blockchain.amount1
  const lockedAssets = (mintedAssets + gap) * constants.blockchain.amount1 / ltvPercent
  const maxWithdrawAssets = stakedAssets - lockedAssets

  return maxWithdrawAssets > min ? maxWithdrawAssets : 0n
}


export default wrapAbortPromise<GetMaxWithdrawInput, bigint>(getMaxWithdraw)
