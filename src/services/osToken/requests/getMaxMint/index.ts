import * as z from 'zod/mini'

import { constants, schema, parseArgs } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'


const validateSchema = z.object({
  ltvPercent: schema.bigint,
  mintedAssets: schema.bigint,
  stakedAssets: schema.bigint,
  vaultAddress: schema.ethAddress,
})

export type GetMaxMintInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getMaxMint = async (values: GetMaxMintInput) => {
  const { contracts, ltvPercent, mintedAssets, stakedAssets } = values

  parseArgs(validateSchema, values)

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
