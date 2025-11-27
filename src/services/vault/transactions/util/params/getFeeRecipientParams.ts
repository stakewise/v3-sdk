import { validateArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


export type SetFeeRecipientParams = {
  feeRecipient: string
}

const getFeeRecipientParams = (values: SetFeeRecipientParams) => {
  const { feeRecipient } = values

  validateArgs.address({ feeRecipient })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setFeeRecipient', args: [ feeRecipient ],
    },
  ]

  return params
}


export default getFeeRecipientParams
