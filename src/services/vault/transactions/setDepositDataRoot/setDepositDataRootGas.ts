import { commonLogic } from './common'
import { getGas } from '../../../../helpers'
import type { SetDepositDataRootInput } from './types'


const setDepositDataRootGas = async (values: SetDepositDataRootInput) => {
  const { provider, userAddress, vaultAddress, depositDataRoot } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const estimatedGas = await signedDepositDataRegistryContract.setDepositDataRoot.estimateGas(vaultAddress, depositDataRoot)

  return getGas({ estimatedGas, provider: values.provider })
}


export default setDepositDataRootGas
