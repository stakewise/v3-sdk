import { parseEther } from 'ethers'

import getStakeBalance from '../getStakeBalance'
import getOsTokenConfig from '../getOsTokenConfig'
import { constants, divideRoundingUp } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getMintedBalance from '../../../osToken/requests/getBalance'
import getUnstakeAmountForBurn from '../../../osToken/helpers/getUnstakeAmountForBurn'

import { validate } from './validate'


export type GetMaxWithdrawAmountInput = StakeWise.BaseInput & {
  withBurn?: boolean
}

const min = parseEther('0.00001')

const getMaxWithdrawAmount = async (values: GetMaxWithdrawAmountInput) => {
  const { contracts } = values

  const { userAddress, withBurn } = validate(values)

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

  const ltvPercent = BigInt(config.ltvPercent)
  const secondsInHour = 60n * 60n
  const gap = avgRewardPerSecond * secondsInHour * mint.assets / constants.blockchain.amount1

  const lockedAssets = divideRoundingUp((mint.assets + gap) * constants.blockchain.amount1, ltvPercent)
  const assetsWithoutBurn = stake.assets - lockedAssets

  if (!withBurn) {
    return assetsWithoutBurn > min ? assetsWithoutBurn : 0n
  }

  const walletShares = await contracts.tokens.mintToken.balanceOf(userAddress)

  const burnShares = walletShares < mint.shares ? walletShares : mint.shares

  if (burnShares >= mint.shares) {
    return stake.assets
  }

  if (!burnShares) {
    return assetsWithoutBurn > min ? assetsWithoutBurn : 0n
  }

  const { receivedAssets } = await getUnstakeAmountForBurn({ ...values, shares: burnShares })

  return receivedAssets
}


export default wrapAbortPromise<GetMaxWithdrawAmountInput, bigint>(getMaxWithdrawAmount)
