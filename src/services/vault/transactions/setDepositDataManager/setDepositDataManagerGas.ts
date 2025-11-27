import { commonLogic } from './common'
import { getGas } from '../../../../helpers'
import type { SetDepositDataManagerInput } from './types'


const setDepositDataManagerGas = async (values: SetDepositDataManagerInput) => {
  const { provider, userAddress, vaultAddress, managerAddress } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const estimatedGas = await signedDepositDataRegistryContract.setDepositDataManager.estimateGas(vaultAddress, managerAddress)

  return getGas({ estimatedGas, provider: values.provider })
}


export default setDepositDataManagerGas
