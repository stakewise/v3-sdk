import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { SetWhitelisterInput } from './types'


export const commonLogic = (values: Omit<SetWhitelisterInput, 'provider'>) => {
  const { options, contracts, userAddress, vaultAddress, whitelister } = values

  validateArgs.address({ whitelister })

  const baseMulticallArgs = {
    vaultContract: contracts.helpers.createPrivateVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setWhitelister', args: [ whitelister ],
    },
  ]

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
