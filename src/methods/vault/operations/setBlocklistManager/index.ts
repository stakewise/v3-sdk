import checkAccess from './checkAccess'
import { commonLogic } from './common'
import { vaultMulticall } from '../../../../contracts'
import setBlocklistManagerGas from './setBlocklistManagerGas'
import setBlocklistManagerEncode from './setBlocklistManagerEncode'
import type { SetBlocklistManager } from './types'


const setBlocklistManager: SetBlocklistManager = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

setBlocklistManager.encode = checkAccess<StakeWise.TransactionData>(setBlocklistManagerEncode)
setBlocklistManager.estimateGas = checkAccess<bigint>(setBlocklistManagerGas)


export default checkAccess<string>(setBlocklistManager)
