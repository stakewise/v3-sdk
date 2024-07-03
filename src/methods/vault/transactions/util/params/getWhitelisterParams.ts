import { validateArgs } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'


export type SetWhitelisterParams = {
  whitelistManager: string
}

const getWhitelisterParams = (values: SetWhitelisterParams) => {
  const { whitelistManager } = values

  validateArgs.address({ whitelistManager })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setWhitelister', args: [ whitelistManager ],
    },
  ]

  return params
}


export default getWhitelisterParams
