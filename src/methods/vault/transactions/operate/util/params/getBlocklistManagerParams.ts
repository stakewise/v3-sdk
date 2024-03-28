import { validateArgs } from '../../../../../../utils'
import { vaultMulticall } from '../../../../../../contracts'


export type SetBlocklistManagerParams = {
  blocklistManager: string
}

const getParams = (values: SetBlocklistManagerParams) => {
  const { blocklistManager } = values

  validateArgs.address({ blocklistManager })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setBlocklistManager', args: [ blocklistManager ],
    },
  ]

  return params
}


export default getParams
