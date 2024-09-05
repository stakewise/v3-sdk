import { ZeroAddress } from 'ethers'

import type { DepositInput } from '../types'
import { validateArgs } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'
import type { VaultMulticallBaseInput } from '../../../../../contracts'


export const commonLogic = (values: DepositInput) => {
  const { options, contracts, vaultAddress, userAddress, assets } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ vaultAddress, userAddress })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'deposit',
      args: [ assets, userAddress, ZeroAddress ],
    },
  ]

  const baseInput: VaultMulticallBaseInput = {
    vaultContract: contracts.helpers.createOtherTokenVault(vaultAddress),
    vaultAddress,
    userAddress,
    options,
  }

  return {
    ...baseInput,
    request: { params },
  }
}
