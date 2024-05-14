import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetDepositDataManagerRoot } from './types'
import setDepositDataManagerGas from './setDepositDataManagerGas'
import setDepositDataManagerEncode from './setDepositDataManagerEncode'


const setDepositDataManager: SetDepositDataManagerRoot = async (values) => {
  const { provider, userAddress } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedVaultContract = contract.connect(signer)

  const result = await signedVaultContract.setDepositDataManager(values.vaultAddress, values.managerAddress)

  return result?.hash
}

setDepositDataManager.encode = checkAccess<StakeWise.TransactionData>(setDepositDataManagerEncode)
setDepositDataManager.estimateGas = checkAccess<bigint>(setDepositDataManagerGas)


export default checkAccess<string>(setDepositDataManager)
