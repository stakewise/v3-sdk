import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { CreateEigenPod } from './types'
import createEigenPodGas from './createEigenPodGas'
import createEigenPodEncode from './createEigenPodEncode'


const createEigenPod: CreateEigenPod = async (values) => {
  const { provider, userAddress } = values

  const { vaultContract } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  const response = await signedContract.createEigenPod()

  return response.hash
}

createEigenPod.encode = checkAccess(createEigenPodEncode)
createEigenPod.estimateGas = checkAccess(createEigenPodGas)


export default checkAccess(createEigenPod)
