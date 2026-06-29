import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


const setFeePercentParamsSchema = z.object({
  feePercent: schema.number,
})

export type SetFeePercentParams = z.input<typeof setFeePercentParamsSchema>

const getFeePercentParams = (values: SetFeePercentParams) => {
  const { feePercent } = parseArgs(setFeePercentParamsSchema, values)

  if (feePercent < 0) {
    throw new Error(`The "feePercent" argument must be at least 0`)
  }
  if (feePercent > 100) {
    throw new Error(`The "feePercent" argument must be at most 100`)
  }

  const decimals = feePercent.toString().split('.')[1]?.length

  if (decimals > 2) {
    throw new Error(`The "feePercent" argument must have at most two decimal places`)
  }

  const formatedPercent = feePercent * 100 // Fee percent must use this format 5% → 500

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setFeePercent', args: [ formatedPercent ],
    },
  ]

  return params
}


export default getFeePercentParams
