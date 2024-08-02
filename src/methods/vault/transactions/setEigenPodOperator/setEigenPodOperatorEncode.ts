import { commonLogic } from './common'
import { SetEigenPodOperatorInput } from './types'


const setEigenPodOperatorEncode = async (values: SetEigenPodOperatorInput) => {
  const { eigenPodOwnerContract } = await commonLogic(values)

  return eigenPodOwnerContract.eigenPod.populateTransaction()
}


export default setEigenPodOperatorEncode
