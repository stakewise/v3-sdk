import { parseEther } from 'ethers'

import getStakeBalance from '../getStakeBalance'
import getOsTokenConfig from '../getOsTokenConfig'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getMintedBalance from '../../../osToken/requests/getBalance'
import { constants, parseArgs, baseInputSchema } from '../../../../helpers'


export type GetMaxWithdrawAmountInput = StakeWise.BaseInput

const min = parseEther('0.00001')

const getMaxWithdrawAmount = async (values: GetMaxWithdrawAmountInput) => {
  const { contracts } = values

  parseArgs(baseInputSchema, values)

  const [ config, mint, stake ] = await Promise.all([
    getOsTokenConfig(values),
    getMintedBalance(values),
    getStakeBalance(values),
  ])

  if (!mint.assets) {
    return stake.assets
  }

  if (Number(config.ltvPercent) <= 0 || stake.assets < min) {
    return 0n
  }

  const avgRewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const secondsInHour = 60n * 60n
  const gap = avgRewardPerSecond * secondsInHour * mint.assets / constants.blockchain.amount1
  const lockedAssets = (mint.assets + gap) * constants.blockchain.amount1 / BigInt(config.ltvPercent)
  const maxWithdrawAssets = stake.assets - lockedAssets

  return maxWithdrawAssets > min ? maxWithdrawAssets : 0n
}


export default wrapAbortPromise<GetMaxWithdrawAmountInput, bigint>(getMaxWithdrawAmount)
