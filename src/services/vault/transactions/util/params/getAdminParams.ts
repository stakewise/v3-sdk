import { validateArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


export type SetAdminParams = {
  admin: string
}

const getAdminParams = (values: SetAdminParams) => {
  const { admin } = values

  validateArgs.address({ admin })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setAdmin', args: [ admin ],
    },
  ]

  return params
}


export default getAdminParams
