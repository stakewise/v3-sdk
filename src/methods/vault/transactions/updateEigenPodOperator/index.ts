import { commonLogic } from './common'
import updateEigenPodOperatorGas from './updateEigenPodOperatorGas'
import updateEigenPodOperatorEncode from './updateEigenPodOperatorEncode'
import type { UpdateEigenPodOperator } from './types'

import { checkRestakeOperatorsManagerAccess as checkAccess } from '../util'

import { eigenPodOwnerMulticall } from '../../../../contracts'


const updateEigenPodOperator: UpdateEigenPodOperator = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await eigenPodOwnerMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateEigenPodOperator.encode = checkAccess(updateEigenPodOperatorEncode)
updateEigenPodOperator.estimateGas = checkAccess(updateEigenPodOperatorGas)


export default checkAccess(updateEigenPodOperator)
