import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { RejectSubVaultInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const rejectSubVault = checkAccess<string>(async (values: RejectSubVaultInput) => {
  const { provider, userAddress, subVaultAddress } = values

  const signer = await provider.getSigner(userAddress)

  const contract = commonLogic(values)
  const signedContract = contract.connect(signer)

  const result = await wrapErrorHandler(
    signedContract.rejectMetaSubVault(subVaultAddress),
    'transaction'
  )

  return result?.hash
})


export default rejectSubVault
