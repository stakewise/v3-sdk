import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { SetKeysManagerInput } from './types'


export const commonLogic = (values: Omit<SetKeysManagerInput, 'provider'>) => {
  const { options, contracts, userAddress, vaultAddress, keysManager } = values

  validateArgs.address({ keysManager })

  const baseMulticallArgs = {
    vaultContract: contracts.helpers.createVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setKeysManager', args: [ keysManager ],
    },
  ]

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
