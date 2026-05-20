import type { RescueAssetsInput } from './types'
import { validateArgs } from '../../../../helpers'
import { VaultMulticallBaseInput } from '../../../../contracts'


export const commonLogic = (values: RescueAssetsInput) => {
  const { contracts, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const baseMulticallArgs: VaultMulticallBaseInput = {
    ...values,
    vaultContract,
  }

  return {
    ...baseMulticallArgs,
    request: {
      params: [
        { method: 'rescueAssets', args: [] },
      ],
    },
  }
}
