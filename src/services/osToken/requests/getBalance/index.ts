import { wrapAbortPromise } from '../../../../modules/gql-module'
import { parseArgs, baseInputSchema } from '../../../../helpers'


export type GetOsTokenBalanceInput = StakeWise.BaseInput

type Output = {
  assets: bigint
  shares: bigint
}

const getBalance = async (values: GetOsTokenBalanceInput) => {
  const { contracts, vaultAddress, userAddress } = values

  parseArgs(baseInputSchema, values)

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
