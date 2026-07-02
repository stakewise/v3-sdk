import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


const setWhitelisterParamsSchema = z.object({
  whitelistManager: schema.ethAddress,
})

export type SetWhitelisterParams = z.input<typeof setWhitelisterParamsSchema>

const getWhitelisterParams = (values: SetWhitelisterParams) => {
  const { whitelistManager } = parseArgs(setWhitelisterParamsSchema, values)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setWhitelister', args: [ whitelistManager ],
    },
  ]

  return params
}


export default getWhitelisterParams
