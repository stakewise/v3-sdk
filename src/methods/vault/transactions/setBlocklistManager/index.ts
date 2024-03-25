import { SetBlocklistManager } from './types'
import { commonLogic } from './common'
import setBlocklistManagerGas from './setBlocklistManagerGas'
import setBlocklistManagerEncode from './setBlocklistManagerEncode'
import { vaultMulticall } from '../../../../contracts'


const setBlocklistManager: SetBlocklistManager = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

setBlocklistManager.encode = setBlocklistManagerEncode
setBlocklistManager.estimateGas = setBlocklistManagerGas


export default setBlocklistManager
