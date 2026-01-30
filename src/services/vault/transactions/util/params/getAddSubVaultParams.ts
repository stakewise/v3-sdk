import { validateArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


export type AddSubVaultParams = {
  subVaultAddress: string
}

const getAddSubVaultParams = (values: AddSubVaultParams) => {
  const { subVaultAddress } = values

  validateArgs.address({ subVaultAddress })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'addSubVault', args: [ subVaultAddress ],
    },
  ]

  return params
}


export default getAddSubVaultParams
