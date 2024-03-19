import { commonLogic } from './common'
import { UpdateBlocklistInput } from './types'
import { getGas } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


const updateBlocklistGas = async (values: UpdateBlocklistInput) => {
  const { params, multicallCommonArgs } = commonLogic(values)

  const estimatedGas = await vaultMulticall<bigint>({
    ...multicallCommonArgs,
    request: {
      estimateGas: true,
      params,
    },
  })

  const gas = await getGas({ estimatedGas, provider: values.provider })

  return gas
}


export default updateBlocklistGas
