import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


export type SetWhitelisterParams = {
  whitelister: string
}

export const getParams = (values: SetWhitelisterParams) => {
  const { whitelister } = values

  validateArgs.address({ whitelister })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setWhitelister', args: [ whitelister ],
    },
  ]

  return params
}
