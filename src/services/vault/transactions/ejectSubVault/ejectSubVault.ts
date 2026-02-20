import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { EjectSubVaultInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const ejectSubVault = checkAccess<string>(async (values: EjectSubVaultInput) => {
  const { provider, userAddress, subVaultAddress } = values

  const signer = await provider.getSigner(userAddress)

  const contract = await commonLogic(values)
  const signedContract = contract.connect(signer)

  const result = await wrapErrorHandler(
    signedContract.ejectSubVault(subVaultAddress),
    'transaction'
  )

  return result?.hash
})


export default ejectSubVault
