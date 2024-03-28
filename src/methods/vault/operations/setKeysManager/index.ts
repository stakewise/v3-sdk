import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


export type SetKeysManagerParams = {
  keysManager: string
}

export const getParams = (values: SetKeysManagerParams) => {
  const { keysManager } = values

  validateArgs.address({ keysManager })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setKeysManager', args: [ keysManager ],
    },
  ]

  return params
}
