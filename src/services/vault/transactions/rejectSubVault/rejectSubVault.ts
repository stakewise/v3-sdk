import { commonLogic } from './common'
import { checkAccess } from '../util'
import type { RejectSubVaultInput } from './types'
import { sendWithGasMargin } from '../../../../helpers'


const rejectSubVault = checkAccess<RejectSubVaultInput>(async (values) => {
  const { provider, userAddress, subVaultAddress } = values

  const signer = await provider.getSigner(userAddress)

  const contract = await commonLogic(values)
  const signedContract = contract.connect(signer)

  const result = await sendWithGasMargin(signedContract.rejectMetaSubVault, [ subVaultAddress ])

  return result?.hash
})


export default rejectSubVault
