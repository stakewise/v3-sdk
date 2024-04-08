import { commonLogic } from './common'
import type { SetDepositDataRootInput } from './types'


const setDepositDataRootEncode = async (values: SetDepositDataRootInput) => {
  const contract = commonLogic(values)

  const rx = await contract.setDepositDataRoot.populateTransaction(values.vaultAddress, values.validatorsRoot)

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default setDepositDataRootEncode
