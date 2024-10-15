import { commonLogic } from './common'
import type { CreateEigenPod } from './types'
import createEigenPodGas from './createEigenPodGas'
import createEigenPodEncode from './createEigenPodEncode'

import { checkRestakeOperatorsManagerAccess as checkAccess } from '../util'


const createEigenPod: CreateEigenPod = async (values) => {
  const { provider, userAddress } = values

  const contract = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = contract.connect(signer)

  const response = await signedContract.createEigenPod()

  return response.hash
}

createEigenPod.encode = checkAccess(createEigenPodEncode)
createEigenPod.estimateGas = checkAccess(createEigenPodGas)


export default checkAccess(createEigenPod)
