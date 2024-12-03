import { commonLogic } from './common'
import type { SetDepositDataRootInput } from './types'


const setDepositDataRootEncode = async (values: SetDepositDataRootInput) => {
  const contract = commonLogic(values)

  return contract.setDepositDataRoot.populateTransaction(values.vaultAddress, values.depositDataRoot)
}


export default setDepositDataRootEncode
