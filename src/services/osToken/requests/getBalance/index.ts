import { wrapAbortPromise } from '../../../../modules/gql-module'
import { validateArgs } from '../../../../helpers'


export type GetOsTokenBalanceInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
}

type Output = {
  assets: bigint
  shares: bigint
}

const getBalance = async (values: GetOsTokenBalanceInput) => {
  const { contracts, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

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
