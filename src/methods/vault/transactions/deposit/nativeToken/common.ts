import { ZeroAddress } from 'ethers'

import type { DepositInput } from '../types'
import { validateArgs } from '../../../../../utils'


export const commonLogic = async (values: DepositInput) => {
  const { contracts, vaultAddress, userAddress, assets } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVault(vaultAddress)
  const canHarvest = await contracts.base.keeper.canHarvest(vaultAddress)

  const overrides = {
    value: assets,
  }

  return { vaultContract, canHarvest, overrides }
}


export const referrer = ZeroAddress
