import { ZeroAddress } from 'ethers'

import { validate } from '../validate'
import type { DepositInput } from '../types'
import getHarvestParams from '../../../requests/getHarvestParams'
import { PayableOverrides } from '../../../../../contracts/types/common'
import { HarvestParamsQueryPayload } from '../../../../../graphql/subgraph/vault'


type HarvestParams = Omit<HarvestParamsQueryPayload['harvestParams'], 'canHarvest'>
type BaseParams = [ string, string, PayableOverrides ]
type UpdateStateParams = [ string, string, HarvestParams, PayableOverrides ]

export const commonLogic = async (values: DepositInput) => {
  const { contracts, userAddress, vaultAddress, referrerAddress = ZeroAddress, assets } = values

  validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const overrides = {
    value: assets,
  }

  const { params: harvestParams, canHarvest } = await getHarvestParams(values)

  const baseParams: BaseParams = [ userAddress, referrerAddress ]
  const updateStateParams: UpdateStateParams = [ userAddress, referrerAddress, harvestParams ]

  return {
    vaultContract,
    baseParams,
    updateStateParams,
    canHarvest,
  }
}
