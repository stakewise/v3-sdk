import { commonLogic } from './common'
import { getGas, handleContractError } from '../../../../helpers'
import type { SetDepositDataManagerInput } from './types'


const setDepositDataManagerGas = async (values: SetDepositDataManagerInput) => {
  const { provider, userAddress, vaultAddress, managerAddress } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = contract.connect(signer)

  const estimatedGas = await handleContractError(
    signedContract.setDepositDataManager.estimateGas(vaultAddress, managerAddress),
    'transaction'
  )

  return getGas({ estimatedGas, provider: values.provider })
}


export default setDepositDataManagerGas
