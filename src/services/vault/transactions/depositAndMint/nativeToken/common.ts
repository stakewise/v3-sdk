import { validate } from '../validate'
import type { DepositAndMintInput } from '../types'
import getHarvestArgs, { HarvestArgs } from '../../../../../contracts/ownMulticalls/util/getHarvestArgs'
import { PayableOverrides } from '../../../../../contracts/types/common'


type BaseParams = [ string, bigint, string, PayableOverrides ]
type UpdateStateParams = [ string, bigint, string, HarvestArgs, PayableOverrides ]

export const commonLogic = async (values: DepositAndMintInput) => {
  const { contracts } = values

  const { userAddress, vaultAddress, referrerAddress, assets, receiveShares } = validate(values)

  const vaultContract = contracts.helpers.createVault({
    vaultAddress,
    options: {
      isDepositWithMint: true,
    },
  })

  const overrides = {
    value: assets,
  }

  const harvestArgs = await getHarvestArgs(values)

  const baseParams: BaseParams = [ userAddress, receiveShares, referrerAddress, overrides ]
  const updateStateParams: UpdateStateParams = [ userAddress, receiveShares, referrerAddress, harvestArgs as HarvestArgs, overrides ]

  return {
    vaultContract,
    baseParams,
    updateStateParams,
    canHarvest: Boolean(harvestArgs),
  }
}
