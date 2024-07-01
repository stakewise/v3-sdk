import { commonLogic } from './common'
import updateEigenPodOperatorGas from './updateEigenPodOperatorGas'
import updateEigenPodOperatorEncode from './updateEigenPodOperatorEncode'
import type { UpdateEigenPodOperator } from './types'
import { eigenPodOwnerMulticall } from '../../../../contracts'


const updateEigenPodOperator: UpdateEigenPodOperator = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await eigenPodOwnerMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateEigenPodOperator.encode = updateEigenPodOperatorEncode
updateEigenPodOperator.estimateGas = updateEigenPodOperatorGas


export default updateEigenPodOperator
