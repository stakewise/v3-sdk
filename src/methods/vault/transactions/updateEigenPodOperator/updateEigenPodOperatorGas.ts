import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { UpdateEigenPodOperatorInput } from './types'
import { eigenPodOwnerMulticall } from '../../../../contracts'


const updateEigenPodOperatorGas = async (values: UpdateEigenPodOperatorInput) => {
  const { provider } = values

  const multicallArgs = await commonLogic(values)

  const estimatedGas = await eigenPodOwnerMulticall<bigint>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      estimateGas: true,
    },
  })

  return getGas({ estimatedGas, provider })
}


export default updateEigenPodOperatorGas
