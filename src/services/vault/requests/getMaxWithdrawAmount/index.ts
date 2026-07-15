import { parseEther } from 'ethers'

import getStakeBalance from '../getStakeBalance'
import getHarvestParams from '../getHarvestParams'
import getOsTokenConfig from '../getOsTokenConfig'
import { constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getMintedBalance from '../../../osToken/requests/getBalance'

import { validate } from './validate'


export type GetMaxWithdrawAmountInput = StakeWise.BaseInput & {
  withBurn?: boolean
}

const min = parseEther('0.00001')

const getMaxWithdrawAmount = async (values: GetMaxWithdrawAmountInput) => {
  const { contracts } = values

  const { userAddress, vaultAddress, withBurn } = validate(values)

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
  const assetsWithoutBurn = stake.assets - lockedAssets

  if (!withBurn) {
    return assetsWithoutBurn > min ? assetsWithoutBurn : 0n
  }

  const [ walletShares, harvest ] = await Promise.all([
    contracts.tokens.mintToken.balanceOf(userAddress),
    getHarvestParams(values),
  ])

  const burnShares = walletShares < mint.shares ? walletShares : mint.shares

  if (burnShares >= mint.shares) {
    return stake.assets
  }

  if (!burnShares) {
    return assetsWithoutBurn > min ? assetsWithoutBurn : 0n
  }

  const { receivedAssets } = await contracts.special.stakeCalculator.calculateUnstake.staticCall({
    user: userAddress,
    vault: vaultAddress,
    harvestParams: harvest.params,
    osTokenShares: burnShares,
  })

  return assetsWithoutBurn + receivedAssets
}


export default wrapAbortPromise<GetMaxWithdrawAmountInput, bigint>(getMaxWithdrawAmount)
