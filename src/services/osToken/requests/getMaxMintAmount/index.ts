import getBalance from '../getBalance'
import { constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getStakeBalance from '../../../vault/requests/getStakeBalance'
import getOsTokenConfig from '../../../vault/requests/getOsTokenConfig'

import { validate } from './validate'


export type GetMaxMintAmountInput = StakeWise.BaseInput & {
  additionalStakedAssets?: bigint
}

const getMaxMintAmount = async (values: GetMaxMintAmountInput) => {
  const { contracts, additionalStakedAssets } = values

  validate(values)

  const [ config, stake, mint ] = await Promise.all([
    getOsTokenConfig(values),
    getStakeBalance(values),
    getBalance(values),
  ])

  const ltvPercent = BigInt(config.ltvPercent)
  const stakedAssets = stake.assets + (additionalStakedAssets || 0n)
  const mintedAssets = mint.assets

  if (ltvPercent <= 0 || stakedAssets <= 0) {
    return 0n
  }

  const avgRewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const maxMintedAssets = stakedAssets * ltvPercent / constants.blockchain.amount1
  const maxMintedAssetsHourReward = (maxMintedAssets * avgRewardPerSecond * 3600n) / constants.blockchain.amount1
  const maxMintAssets = maxMintedAssets - maxMintedAssetsHourReward - mintedAssets

  if (maxMintAssets > 0) {
    const maxMintShares = await contracts.base.mintTokenController.convertToShares(maxMintAssets)

    // solves the problem of incorrect rounding
    return maxMintShares > 0n ? maxMintShares - 1n : 0n
  }

  return 0n
}


export default wrapAbortPromise<GetMaxMintAmountInput, bigint>(getMaxMintAmount)
