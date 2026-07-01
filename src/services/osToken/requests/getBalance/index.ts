import { wrapAbortPromise } from '../../../../modules/gql-module'

import { validate } from './validate'


export type GetOsTokenBalanceInput = StakeWise.BaseInput

type Output = {
  assets: bigint
  shares: bigint
}

const getBalance = async (values: GetOsTokenBalanceInput) => {
  const { contracts } = values

  const { vaultAddress, userAddress } = validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })
  const mintedShares = await vaultContract.osTokenPositions(userAddress)
  const mintedAssets = await contracts.base.mintTokenController.convertToAssets(mintedShares)

  const result: Output = {
    assets: mintedAssets,
    shares: mintedShares,
  }

  return result
}


export default wrapAbortPromise<GetOsTokenBalanceInput, Output>(getBalance)
