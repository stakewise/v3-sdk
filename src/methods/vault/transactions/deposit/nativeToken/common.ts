import { ZeroAddress } from 'ethers'

import type { DepositInput } from '../types'
import { validateArgs } from '../../../../../utils'


export const commonLogic = async (values: DepositInput) => {
  const { contracts, vaultAddress, assets } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ vaultAddress })

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const overrides = {
    value: assets,
  }

  return { vaultContract, overrides }
}


export const referrer = ZeroAddress
