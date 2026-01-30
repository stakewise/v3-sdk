import { validateArgs } from '../../../../../helpers'
import { vaultMulticall } from '../../../../../contracts'


export type RejectMetaSubVaultParams = {
  rejectMetaSubVaultAddress: string
}

const getRejectSubVaultParams = (values: RejectMetaSubVaultParams) => {
  const { rejectMetaSubVaultAddress } = values

  validateArgs.address({ rejectMetaSubVaultAddress })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'rejectMetaSubVault', args: [ rejectMetaSubVaultAddress ],
    },
  ]

  return params
}


export default getRejectSubVaultParams
