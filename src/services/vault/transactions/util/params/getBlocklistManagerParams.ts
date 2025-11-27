import { validateArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


export type SetBlocklistManagerParams = {
  blocklistManager: string
}

const getBlocklistManagerParams = (values: SetBlocklistManagerParams) => {
  const { blocklistManager } = values

  validateArgs.address({ blocklistManager })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setBlocklistManager', args: [ blocklistManager ],
    },
  ]

  return params
}


export default getBlocklistManagerParams
