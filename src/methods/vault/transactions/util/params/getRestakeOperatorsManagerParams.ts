import { validateArgs } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'


export type SetRestakeOperatorsManagerParams = {
  restakeOperatorsManager: string
}

const getRestakeOperatorsManagerParams = (values: SetRestakeOperatorsManagerParams) => {
  const { restakeOperatorsManager } = values

  validateArgs.address({ restakeOperatorsManager })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setRestakeOperatorsManager',
      args: [ restakeOperatorsManager ],
    },
  ]

  return params
}


export default getRestakeOperatorsManagerParams
