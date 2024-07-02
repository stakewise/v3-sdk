import { validateArgs } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'


export type SetRestakeWithdrawalsManagerParams = {
  restakeWithdrawalsManager: string
}

const getRestakeWithdrawalsManagerParams = (values: SetRestakeWithdrawalsManagerParams) => {
  const { restakeWithdrawalsManager } = values

  validateArgs.address({ restakeWithdrawalsManager })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setRestakeWithdrawalsManager',
      args: [ restakeWithdrawalsManager ],
    },
  ]

  return params
}


export default getRestakeWithdrawalsManagerParams
