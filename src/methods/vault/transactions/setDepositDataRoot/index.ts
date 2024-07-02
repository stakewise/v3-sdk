import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetDepositDataRoot } from './types'
import setDepositDataRootGas from './setDepositDataRootGas'
import setDepositDataRootEncode from './setDepositDataRootEncode'


const setDepositDataRoot: SetDepositDataRoot = async (values) => {
  const { provider, userAddress, vaultAddress, validatorsRoot } = values

  const contract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const result = await signedDepositDataRegistryContract.setDepositDataRoot(vaultAddress, validatorsRoot)

  return result?.hash
}

setDepositDataRoot.encode = checkAccess<StakeWise.TransactionData>(setDepositDataRootEncode)
setDepositDataRoot.estimateGas = checkAccess<bigint>(setDepositDataRootGas)


export default checkAccess<string>(setDepositDataRoot)
