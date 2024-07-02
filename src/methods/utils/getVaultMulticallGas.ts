import { getGas } from '../../utils'
import { vaultMulticall } from '../../contracts'


type Input = Parameters<typeof vaultMulticall>[0] & {
  provider: StakeWise.Provider
}

const getVaultMulticallGas = async (values: Input) => {
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


export default getVaultMulticallGas
