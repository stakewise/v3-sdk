import { commonLogic } from './common'
import { getGas, wrapErrorHandler } from '../../../../helpers'
import type { RejectSubVaultInput } from './types'


const rejectSubVaultGas = async (values: RejectSubVaultInput) => {
  const { provider, userAddress, subVaultAddress } = values

  const contract = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = contract.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedContract.rejectMetaSubVault.estimateGas(subVaultAddress),
    'gas'
  )

  return getGas({ estimatedGas, provider: values.provider })
}


export default rejectSubVaultGas
