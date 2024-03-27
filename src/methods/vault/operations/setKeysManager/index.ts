import checkAccess from './checkAccess'
import { commonLogic } from './common'
import setKeysManagerGas from './setKeysManagerGas'
import setKeysManagerEncode from './setKeysManagerEncode'
import type { SetKeysManager } from './types'
import { vaultMulticall } from '../../../../contracts'


const setKeysManager: SetKeysManager = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

setKeysManager.encode = checkAccess<StakeWise.TransactionData>(setKeysManagerEncode)
setKeysManager.estimateGas = checkAccess<bigint>(setKeysManagerGas)


export default checkAccess<string>(setKeysManager)
