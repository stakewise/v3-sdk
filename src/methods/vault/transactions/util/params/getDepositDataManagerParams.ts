import { validateArgs } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'


export type SetDepositDataManagerParams = {
  depositDataManager: string
}

const getDepositDataManagerParams = (values: SetDepositDataManagerParams) => {
  const { depositDataManager } = values

  validateArgs.address({ depositDataManager })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setKeysManager', args: [ depositDataManager ],
    },
  ]

  return params
}


export default getDepositDataManagerParams
