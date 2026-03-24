import { commonLogic } from './common'
import type { RejectSubVaultInput } from './types'


const rejectSubVaultEncode = async (values: RejectSubVaultInput) => {
  const contract = await commonLogic(values)

  return contract.rejectMetaSubVault.populateTransaction(values.subVaultAddress)
}


export default rejectSubVaultEncode
