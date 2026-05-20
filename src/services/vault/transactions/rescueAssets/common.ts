import { validateArgs } from '../../../../helpers'
import { vaultMulticall, VaultMulticallBaseInput } from '../../../../contracts'

import type { RescueAssetsInput } from './types'


export const commonLogic = async (values: RescueAssetsInput) => {
  const { contracts, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const baseMulticallArgs: VaultMulticallBaseInput = {
    vaultContract,
    ...values,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    { method: 'rescueAssets', args: [] },
  ]

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
