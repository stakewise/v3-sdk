import { parseEther } from 'ethers'

import getStakeBalance from '../getStakeBalance'
import getOsTokenConfig from '../getOsTokenConfig'
import { constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getMintedBalance from '../../../osToken/requests/getBalance'

import { validate } from './validate'


export type GetMaxWithdrawAmountInput = StakeWise.BaseInput & {
  withBurn?: boolean
}

const min = parseEther('0.00001')

const secondsInHour = 60n * 60n

// The vault floors every conversion on its LTV check, the buffer adds 3 wei to fix that
const ltvCheckBuffer = 3n

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

  let debtAssets = mint.assets

  if (withBurn) {
    const walletShares = await contracts.tokens.mintToken.balanceOf(userAddress)
    const burnShares = walletShares < mint.shares ? walletShares : mint.shares

    debtAssets = await contracts.base.mintTokenController.convertToAssets(mint.shares - burnShares)
  }

  const gap = avgRewardPerSecond * secondsInHour * mint.assets / constants.blockchain.amount1
  const lockedAssets = (debtAssets + gap) * constants.blockchain.amount1 / BigInt(config.ltvPercent)
  const maxWithdrawAssets = stake.assets - lockedAssets - ltvCheckBuffer

  return maxWithdrawAssets > min ? maxWithdrawAssets : 0n
}


export default wrapAbortPromise<GetMaxWithdrawAmountInput, bigint>(getMaxWithdrawAmount)
