import { commonLogic } from './common'
import { getGas, wrapErrorHandler } from '../../../../helpers'
import type { EjectSubVaultInput } from './types'


const ejectSubVaultGas = async (values: EjectSubVaultInput) => {
  const { provider, userAddress, subVaultAddress } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = contract.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedContract.ejectSubVault.estimateGas(subVaultAddress),
    'transaction'
  )

  return getGas({ estimatedGas, provider: values.provider })
}


export default ejectSubVaultGas
