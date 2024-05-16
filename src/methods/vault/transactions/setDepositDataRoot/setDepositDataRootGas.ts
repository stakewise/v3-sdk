import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { SetDepositDataRootInput } from './types'


const setDepositDataRootGas = async (values: SetDepositDataRootInput) => {
  const { provider, userAddress, vaultAddress, validatorsRoot } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const estimatedGas = await signedDepositDataRegistryContract.setDepositDataRoot.estimateGas(vaultAddress, validatorsRoot)

  return getGas({ estimatedGas, provider: values.provider })
}


export default setDepositDataRootGas
