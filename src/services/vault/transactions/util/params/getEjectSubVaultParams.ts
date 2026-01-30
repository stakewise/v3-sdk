import { validateArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


export type EjectMetaSubVaultParams = {
  ejectSubVaultAddress: string
}

const getEjectSubVaultParams = (values: EjectMetaSubVaultParams) => {
  const { ejectSubVaultAddress } = values

  validateArgs.address({ ejectSubVaultAddress })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'ejectSubVault', args: [ ejectSubVaultAddress ],
    },
  ]

  return params
}


export default getEjectSubVaultParams
