import { commonLogic } from './common'
import { getGas, wrapErrorHandler } from '../../../../helpers'
import type { AddSubVaultInput } from './types'


const addSubVaultGas = async (values: AddSubVaultInput) => {
  const { provider, userAddress, subVaultAddress } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = contract.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedContract.addSubVault.estimateGas(subVaultAddress),
    'transaction'
  )

  return getGas({ estimatedGas, provider: values.provider })
}


export default addSubVaultGas
