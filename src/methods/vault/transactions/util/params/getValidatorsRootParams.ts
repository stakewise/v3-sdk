import { validateArgs } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'


export type SetValidatorsRootParams = {
  validatorsRoot: string
}

const getValidatorsRootParams = (values: SetValidatorsRootParams) => {
  const { validatorsRoot } = values

  validateArgs.string({ validatorsRoot })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setValidatorsRoot', args: [ validatorsRoot ],
    },
  ]

  return params
}


export default getValidatorsRootParams
