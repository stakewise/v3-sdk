import { commonLogic } from './common'
import type { SetDepositDataRootInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const setDepositDataRootGas = async (values: SetDepositDataRootInput) => {
  const { provider, userAddress, vaultAddress, depositDataRoot } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedDepositDataRegistryContract.setDepositDataRoot.estimateGas(vaultAddress, depositDataRoot),
    'gas'
  )

  return getGas({ estimatedGas, provider: values.provider })
}


export default setDepositDataRootGas
