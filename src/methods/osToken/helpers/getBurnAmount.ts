import { validateArgs, getValidLtvPercent } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


type GetBurnAmountInput = {
  ltvPercent: bigint
  mintedAssets: bigint
  stakedAssets: bigint
  vaultAddress: string
  newStakedAssets: bigint
  contracts: StakeWise.Contracts
}

const getBurnAmount = async (values: GetBurnAmountInput) => {
  const { contracts, vaultAddress, ltvPercent, mintedAssets, stakedAssets, newStakedAssets } = values

  validateArgs.address({ vaultAddress })
  validateArgs.bigint({ ltvPercent, mintedAssets, stakedAssets, newStakedAssets })

  const hasMinted = mintedAssets && mintedAssets > 0

  if (!hasMinted) {
    return 0n
  }

  const percent = await getValidLtvPercent({ vaultAddress, ltvPercent, contracts })

  const stakedWithPercent = (stakedAssets - newStakedAssets) * percent / 10_000n
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
