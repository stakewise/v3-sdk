import { commonLogic } from './common'
import { SetEigenPodOperatorInput } from './types'


const setEigenPodOperatorEncode = async (values: SetEigenPodOperatorInput) => {
  const { eigenPodOwnerContract } = await commonLogic(values)

  const rx = await eigenPodOwnerContract.eigenPod.populateTransaction()

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default setEigenPodOperatorEncode
