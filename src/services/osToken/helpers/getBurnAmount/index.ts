import * as z from 'zod/mini'

import { constants, schema, parseArgs } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'


const getBurnAmountSchema = z.object({
  ltvPercent: schema.bigint,
  mintedAssets: schema.bigint,
  stakedAssets: schema.bigint,
  newStakedAssets: schema.bigint,
  vaultAddress: schema.ethAddress,
})

export type GetBurnAmountInput = StakeWise.CommonParams & z.input<typeof getBurnAmountSchema>

const getBurnAmount = async (values: GetBurnAmountInput) => {
  const { contracts, ltvPercent, mintedAssets, stakedAssets, newStakedAssets } = values

  parseArgs(getBurnAmountSchema, values)

  const hasMinted = mintedAssets && mintedAssets > 0

  if (!hasMinted) {
    return 0n
  }

  const stakedWithPercent = (stakedAssets - newStakedAssets) * ltvPercent / constants.blockchain.amount1

  const assetsToBurn = mintedAssets - stakedWithPercent

  if (assetsToBurn > 0) {
    const assetsResult = assetsToBurn > mintedAssets
      ? mintedAssets
      : assetsToBurn

    const sharesToBurn = await contracts.base.mintTokenController.convertToShares(assetsResult)

    return sharesToBurn || 0n
  }

  return 0n
}


export default wrapAbortPromise<GetBurnAmountInput, bigint>(getBurnAmount)
