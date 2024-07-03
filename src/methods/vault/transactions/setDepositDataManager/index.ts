import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetDepositDataManagerRoot } from './types'
import setDepositDataManagerGas from './setDepositDataManagerGas'
import setDepositDataManagerEncode from './setDepositDataManagerEncode'


const setDepositDataManager: SetDepositDataManagerRoot = async (values) => {
  const { provider, userAddress, managerAddress, vaultAddress } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const result = await signedDepositDataRegistryContract.setDepositDataManager(vaultAddress, managerAddress)

  return result?.hash
}

setDepositDataManager.encode = checkAccess<StakeWise.TransactionData>(setDepositDataManagerEncode)
setDepositDataManager.estimateGas = checkAccess<bigint>(setDepositDataManagerGas)


export default checkAccess<string>(setDepositDataManager)
