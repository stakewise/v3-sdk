import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


const setAdminParamsSchema = z.object({
  admin: schema.ethAddress,
})

export type SetAdminParams = z.input<typeof setAdminParamsSchema>

const getAdminParams = (values: SetAdminParams) => {
  const { admin } = parseArgs(setAdminParamsSchema, values)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setAdmin', args: [ admin ],
    },
  ]

  return params
}


export default getAdminParams
