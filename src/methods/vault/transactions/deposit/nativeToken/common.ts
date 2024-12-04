import { ZeroAddress } from 'ethers'

import { validate } from '../validate'
import type { DepositInput } from '../types'
import getHarvestParams from 'methods/vault/requests/getHarvestParams'


export const commonLogic = async (values: DepositInput) => {
  const { options, contracts, userAddress, vaultAddress, referrerAddress = ZeroAddress, assets } = values

  validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const overrides = {
    value: assets,
  }

  const { params: harvestParams, canHarvest } = await getHarvestParams({ options, vaultAddress })

  const params = canHarvest
    ? [ userAddress, referrerAddress, harvestParams, overrides ]
    : [ userAddress, referrerAddress, overrides ]

  return {
    vaultContract,
    params,
    canHarvest,
  }
}
