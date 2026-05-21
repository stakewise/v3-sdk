import { commonLogic } from './common'
import type { AddSubVaultInput } from './types'


const addSubVaultEncode = async (values: AddSubVaultInput) => {
  const contract = await commonLogic(values)

  return contract.addSubVault.populateTransaction(values.subVaultAddress)
}


export default addSubVaultEncode
