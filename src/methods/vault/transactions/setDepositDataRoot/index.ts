import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetDepositDataRoot } from './types'
import setDepositDataRootGas from './setDepositDataRootGas'
import setDepositDataRootEncode from './setDepositDataRootEncode'


const setDepositDataRoot: SetDepositDataRoot = async (values) => {
  const contract = commonLogic(values)

  const result = await contract.setDepositDataRoot(values.vaultAddress, values.validatorsRoot)

  return result?.hash
}

setDepositDataRoot.encode = checkAccess<StakeWise.TransactionData>(setDepositDataRootEncode)
setDepositDataRoot.estimateGas = checkAccess<bigint>(setDepositDataRootGas)


export default checkAccess<string>(setDepositDataRoot)
