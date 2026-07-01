import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


const setBlocklistManagerParamsSchema = z.object({
  blocklistManager: schema.ethAddress,
})

export type SetBlocklistManagerParams = z.input<typeof setBlocklistManagerParamsSchema>

const getBlocklistManagerParams = (values: SetBlocklistManagerParams) => {
  const { blocklistManager } = parseArgs(setBlocklistManagerParamsSchema, values)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setBlocklistManager', args: [ blocklistManager ],
    },
  ]

  return params
}


export default getBlocklistManagerParams
