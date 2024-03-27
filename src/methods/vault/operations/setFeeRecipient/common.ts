import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { SetFeeRecipientInput } from './types'


export const commonLogic = (values: Omit<SetFeeRecipientInput, 'provider'>) => {
  const { options, contracts, userAddress, vaultAddress, feeRecipient } = values

  validateArgs.address({ feeRecipient })

  const baseMulticallArgs = {
    vaultContract: contracts.helpers.createVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setFeeRecipient', args: [ feeRecipient ],
    },
  ]

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
