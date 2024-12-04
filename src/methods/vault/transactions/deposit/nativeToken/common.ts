import { ZeroAddress } from 'ethers'

import { validate } from '../validate'
import type { DepositInput } from '../types'
import getHarvestParams from '../../../requests/getHarvestParams'
import { PayableOverrides } from 'contracts/types/common'
import { HarvestParamsQueryPayload } from '../../../../../graphql/subgraph/vault'


type HarvestParams = Omit<HarvestParamsQueryPayload['harvestParams'], 'canHarvest'>
type BaseParams = [ string, string, PayableOverrides ]
type UpdateStateParams = [ string, string, HarvestParams, PayableOverrides ]

export const commonLogic = async (values: DepositInput) => {
  const { options, contracts, userAddress, vaultAddress, referrerAddress = ZeroAddress, assets } = values

  validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const overrides = {
    value: assets,
  }

  const { params: harvestParams, canHarvest } = await getHarvestParams({ options, vaultAddress })

  const baseParams: BaseParams = [ userAddress, referrerAddress, overrides ]
  const updateStateParams: UpdateStateParams = [ userAddress, referrerAddress, harvestParams, overrides ]

  return {
    vaultContract,
    baseParams,
    updateStateParams,
    canHarvest,
  }
}
