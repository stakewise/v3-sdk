import { ZeroAddress } from 'ethers'

import { validate } from '../validate'
import type { DepositInput } from '../types'
import getHarvestArgs, { HarvestArgs } from '../../../../../contracts/multicall/util/getHarvestArgs'
import { PayableOverrides } from '../../../../../contracts/types/common'


type BaseParams = [ string, string, PayableOverrides ]
type UpdateStateParams = [ string, string, HarvestArgs, PayableOverrides ]

export const commonLogic = async (values: DepositInput) => {
  const { contracts, userAddress, vaultAddress, referrerAddress = ZeroAddress, assets } = values

  validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const overrides = {
    value: assets,
  }

  const harvestArgs = await getHarvestArgs(values)

  const baseParams: BaseParams = [ userAddress, referrerAddress, overrides ]
  const updateStateParams: UpdateStateParams = [ userAddress, referrerAddress, harvestArgs as HarvestArgs, overrides ]

  return {
    vaultContract,
    baseParams,
    updateStateParams,
    canHarvest: Boolean(harvestArgs),
  }
}
