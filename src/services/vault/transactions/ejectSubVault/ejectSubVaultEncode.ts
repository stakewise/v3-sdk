import { commonLogic } from './common'
import type { EjectSubVaultInput } from './types'


const ejectSubVaultEncode = async (values: EjectSubVaultInput) => {
  const contract = await commonLogic(values)

  return contract.ejectSubVault.populateTransaction(values.subVaultAddress)
}


export default ejectSubVaultEncode
