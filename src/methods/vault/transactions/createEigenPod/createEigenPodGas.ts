import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { CreateEigenPodInput } from './types'


const depositGas = async (values: CreateEigenPodInput) => {
  const { provider, userAddress } = values

  const contract = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = contract.connect(signer)

  const estimatedGas = await signedContract.createEigenPod.estimateGas()

  return getGas({ estimatedGas, provider })
}


export default depositGas
