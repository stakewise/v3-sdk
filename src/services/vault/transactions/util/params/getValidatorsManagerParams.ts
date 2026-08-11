import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


const setValidatorsManagerParamsSchema = z.object({
  validatorsManager: schema.ethAddress,
})

export type SetValidatorsManagerParams = z.input<typeof setValidatorsManagerParamsSchema>

const getValidatorsManagerParams = (values: SetValidatorsManagerParams) => {
  const { validatorsManager } = parseArgs(setValidatorsManagerParamsSchema, values)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setValidatorsManager',
      args: [ validatorsManager ],
    },
  ]

  return params
}


export default getValidatorsManagerParams
