import { constants } from '../../../../helpers'
import getBalance from '../../requests/getBalance'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getOsTokenConfig from '../../../vault/requests/getOsTokenConfig'

import { validate } from './validate'


export type GetBurnAmountForUnstakeInput = StakeWise.BaseInput

const getBurnAmountForUnstake = async (values: GetBurnAmountForUnstakeInput) => {
  const { contracts } = values

  validate(values)

  const [ config, mint ] = await Promise.all([
    getOsTokenConfig(values),
    getBalance(values),
  ])

  const hasMinted = mint.shares && mint.shares > 0

  if (!hasMinted) {
    return 0n
  }

  const stakedWithPercent = BigInt(config.ltvPercent) / constants.blockchain.amount1

  const assetsToBurn = mint.assets - stakedWithPercent

  if (assetsToBurn > 0) {
    const assetsResult = assetsToBurn > mint.assets
      ? mint.assets
      : assetsToBurn

    const sharesToBurn = await contracts.base.mintTokenController.convertToShares(assetsResult)

    return sharesToBurn || 0n
  }

  return 0n
}


export default wrapAbortPromise<GetBurnAmountForUnstakeInput, bigint>(getBurnAmountForUnstake)
