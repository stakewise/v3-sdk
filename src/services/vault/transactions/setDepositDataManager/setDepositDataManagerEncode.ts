import { commonLogic } from './common'
import type { SetDepositDataManagerInput } from './types'


const setDepositDataManagerEncode = async (values: SetDepositDataManagerInput) => {
  const contract = commonLogic(values)

  return contract.setDepositDataManager.populateTransaction(values.vaultAddress, values.managerAddress)
}


export default setDepositDataManagerEncode
