import { validateArgs } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'


export type SetDepositDataRootParams = {
  depositDataRoot: string
}

const getDepositDataRootParams = (values: SetDepositDataRootParams) => {
  const { depositDataRoot } = values

  validateArgs.string({ depositDataRoot })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setValidatorsRoot', args: [ depositDataRoot ],
    },
  ]

  return params
}


export default getDepositDataRootParams
