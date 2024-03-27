import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { SetValidatorsRootInput } from './types'


export const commonLogic = (values: Omit<SetValidatorsRootInput, 'provider'>) => {
  const { options, contracts, userAddress, vaultAddress, validatorsRoot } = values

  validateArgs.string({ validatorsRoot })

  const baseMulticallArgs = {
    vaultContract: contracts.helpers.createVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setValidatorsRoot', args: [ validatorsRoot ],
    },
  ]

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
