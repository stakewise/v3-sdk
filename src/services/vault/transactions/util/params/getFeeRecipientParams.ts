import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


const setFeeRecipientParamsSchema = z.object({
  feeRecipient: schema.ethAddress,
})

export type SetFeeRecipientParams = z.input<typeof setFeeRecipientParamsSchema>

const getFeeRecipientParams = (values: SetFeeRecipientParams) => {
  const { feeRecipient } = parseArgs(setFeeRecipientParamsSchema, values)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setFeeRecipient', args: [ feeRecipient ],
    },
  ]

  return params
}


export default getFeeRecipientParams
