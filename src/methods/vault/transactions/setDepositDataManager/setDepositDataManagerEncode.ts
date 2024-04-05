import { commonLogic } from './common'
import type { SetDepositDataManagerInput } from './types'


const setDepositDataManagerEncode = async (values: SetDepositDataManagerInput) => {
  const contract = await commonLogic(values)

  const rx = await contract.setDepositDataManager.populateTransaction(values.vaultAddress, values.managerAddress)

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default setDepositDataManagerEncode
