import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { SetBlocklistManagerInput } from './types'


export const commonLogic = (values: SetBlocklistManagerInput) => {
  const { options, contracts, userAddress, vaultAddress, blocklistManager } = values

  validateArgs.address({ blocklistManager })

  const baseMulticallArgs = {
    vaultContract: contracts.helpers.createBlocklistedVault(vaultAddress),
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
