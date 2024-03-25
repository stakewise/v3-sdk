import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import { SetBlocklistManagerInput } from './types'


export const commonLogic = (values: Omit<SetBlocklistManagerInput, 'provider'>) => {
  const { options, contracts, userAddress, vaultAddress, blocklistManager } = values

  validateArgs.address({ blocklistManager })

  const baseMulticallArgs = {
    vaultContract: contracts.helpers.createBlocklistVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setBlocklistManager', args: [ blocklistManager ],
    },
  ]

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
