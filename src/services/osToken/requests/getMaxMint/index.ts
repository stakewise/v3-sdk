import type * as z from 'zod/mini'

import { constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'

import { validate, validateSchema } from './validate'


export type GetMaxMintInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getMaxMint = async (values: GetMaxMintInput) => {
  const { contracts } = values

  const { ltvPercent, mintedAssets, stakedAssets } = validate(values)

  if (ltvPercent <= 0 || stakedAssets <= 0) {
    return 0n
  }

  const avgRewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const maxMintedAssets = stakedAssets * ltvPercent / constants.blockchain.amount1
  const maxMintedAssetsHourReward = (maxMintedAssets * avgRewardPerSecond * 3600n) / constants.blockchain.amount1
  const canMintAssets = maxMintedAssets - maxMintedAssetsHourReward - mintedAssets

  if (canMintAssets > 0) {
    const maxMintShares = await contracts.base.mintTokenController.convertToShares(canMintAssets)

    // solves the problem of incorrect rounding
    return maxMintShares - 1n
  }

  return 0n
}


export default wrapAbortPromise<GetMaxMintInput, bigint>(getMaxMint)
