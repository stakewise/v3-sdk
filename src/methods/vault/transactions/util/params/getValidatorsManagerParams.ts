import { validateArgs } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'


export type SetValidatorsManagerParams = {
  validatorsManager: string
}

const getValidatorsManagerParams = (values: SetValidatorsManagerParams) => {
  const { validatorsManager } = values

  validateArgs.address({ validatorsManager })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setValidatorsManager',
      args: [ validatorsManager ],
    },
  ]

  return params
}


export default getValidatorsManagerParams
