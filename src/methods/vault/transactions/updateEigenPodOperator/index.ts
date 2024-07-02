import { commonLogic } from './common'
import checkAccess from './checkAccess'
import updateEigenPodOperatorGas from './updateEigenPodOperatorGas'
import updateEigenPodOperatorEncode from './updateEigenPodOperatorEncode'
import type { UpdateEigenPodOperator } from './types'
import { eigenPodOwnerMulticall } from '../../../../contracts'


const updateEigenPodOperator: UpdateEigenPodOperator = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await eigenPodOwnerMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateEigenPodOperator.encode = checkAccess(updateEigenPodOperatorEncode)
updateEigenPodOperator.estimateGas = checkAccess(updateEigenPodOperatorGas)


export default checkAccess(updateEigenPodOperator)
