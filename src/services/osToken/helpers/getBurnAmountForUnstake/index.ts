import { constants } from '../../../../helpers'
import getBalance from '../../requests/getBalance'
import getStakeBalance from '../../../vault/requests/getStakeBalance'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getOsTokenConfig from '../../../vault/requests/getOsTokenConfig'

import { validate } from './validate'


export type GetBurnAmountForUnstakeInput = StakeWise.BaseInput & {
  assets?: bigint
}

const secondsInHour = 60n * 60n

const getBurnAmountForUnstake = async (values: GetBurnAmountForUnstakeInput) => {
  const { contracts, assets } = values

  validate(values)

  const [ config, mint, stake ] = await Promise.all([
    getOsTokenConfig(values),
    getBalance(values),
    getStakeBalance(values),
  ])

  const hasMinted = mint.shares && mint.shares > 0

  if (!hasMinted || BigInt(config.ltvPercent) <= 0n) {
    return 0n
  }

  const remainingStake = assets === undefined ? 0n : stake.assets - assets

  if (remainingStake <= 0n) {
    return mint.shares
  }

  const avgRewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const bufferedMaxPercent = constants.blockchain.amount1 + avgRewardPerSecond * secondsInHour
  const allowedMintAssets = remainingStake * BigInt(config.ltvPercent) / bufferedMaxPercent
  const assetsToBurn = mint.assets - allowedMintAssets

  if (assetsToBurn <= 0n) {
    return 0n
  }

  const clampedAssetsToBurn = assetsToBurn > mint.assets ? mint.assets : assetsToBurn
  const sharesToBurn = await contracts.base.mintTokenController.convertToShares(clampedAssetsToBurn)

  return sharesToBurn || 0n
}


export default wrapAbortPromise<GetBurnAmountForUnstakeInput, bigint>(getBurnAmountForUnstake)
