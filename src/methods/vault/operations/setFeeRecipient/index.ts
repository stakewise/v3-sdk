import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


export type SetFeeRecipientParams = {
  feeRecipient: string
}

export const getParams = (values: SetFeeRecipientParams) => {
  const { feeRecipient } = values

  validateArgs.address({ feeRecipient })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setFeeRecipient', args: [ feeRecipient ],
    },
  ]

  return params
}
