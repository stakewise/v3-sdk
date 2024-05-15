import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { SetDepositDataManagerInput } from './types'


const setDepositDataManagerGas = async (values: SetDepositDataManagerInput) => {
  const { provider, userAddress, vaultAddress, managerAddress } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedVaultContract = contract.connect(signer)

  const estimatedGas = await signedVaultContract.setDepositDataManager.estimateGas(vaultAddress, managerAddress)

  return getGas({ estimatedGas, provider: values.provider })
}


export default setDepositDataManagerGas
