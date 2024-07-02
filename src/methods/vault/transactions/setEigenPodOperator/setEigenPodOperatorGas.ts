import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { SetEigenPodOperatorInput } from './types'


const setEigenPodOperatorGas = async (values: SetEigenPodOperatorInput) => {
  const { provider, userAddress } = values

  const { eigenPodOwnerContract } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = eigenPodOwnerContract.connect(signer)

  const estimatedGas = await signedContract.eigenPod.estimateGas()

  return getGas({ estimatedGas, provider })
}


export default setEigenPodOperatorGas
