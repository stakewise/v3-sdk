import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetEigenPodOperator } from './types'
import setEigenPodOperatorGas from './setEigenPodOperatorGas'
import setEigenPodOperatorEncode from './setEigenPodOperatorEncode'


const setEigenPodOperator: SetEigenPodOperator = async (values) => {
  const { provider, userAddress, operatorAddress } = values

  const { eigenPodOwnerContract } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedEigenPodOwnerContract = eigenPodOwnerContract.connect(signer)

  const response = await signedEigenPodOwnerContract.delegateTo(
    operatorAddress,
    {
      signature: '0x',
      expiry: 0,
    },
    '0x0000000000000000000000000000000000000000000000000000000000000000')

  return response.hash
}

setEigenPodOperator.encode = checkAccess(setEigenPodOperatorEncode)
setEigenPodOperator.estimateGas = checkAccess(setEigenPodOperatorGas)


export default checkAccess(setEigenPodOperator)
