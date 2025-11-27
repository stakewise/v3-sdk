import { getGas } from '../../helpers'
import { vaultMulticall } from '../../contracts'


export type GetVaultMulticallGas = Parameters<typeof vaultMulticall>[0] & StakeWise.CommonParams

export const getVaultMulticallGas = async (values: GetVaultMulticallGas) => {
  const { provider } = values

  const estimatedGas = await vaultMulticall<bigint>({
    ...values,
    request: {
      ...values.request,
      estimateGas: true,
    },
  })

  return getGas({ estimatedGas, provider })
}
