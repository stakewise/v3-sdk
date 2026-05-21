import { commonLogic } from './common'
import { checkAccess } from '../util'
import type { AddSubVaultInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const addSubVault = checkAccess<AddSubVaultInput>(async (values) => {
  const { provider, userAddress, subVaultAddress } = values

  const signer = await provider.getSigner(userAddress)

  const contract = await commonLogic(values)
  const signedContract = contract.connect(signer)

  const result = await wrapErrorHandler(
    signedContract.addSubVault(subVaultAddress),
    'transaction'
  )

  return result?.hash
})


export default addSubVault
