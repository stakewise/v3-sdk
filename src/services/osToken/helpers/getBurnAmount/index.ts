import type * as z from 'zod/mini'

import { constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import { validate, validateSchema } from './validate'


export type GetBurnAmountInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getBurnAmount = async (values: GetBurnAmountInput) => {
  const { contracts } = values

  const { ltvPercent, mintedAssets, stakedAssets, newStakedAssets } = validate(values)

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
