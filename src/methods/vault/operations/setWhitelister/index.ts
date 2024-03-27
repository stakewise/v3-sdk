import checkAccess from './checkAccess'
import { commonLogic } from './common'
import setWhitelisterGas from './setWhitelisterGas'
import setWhitelisterEncode from './setWhitelisterEncode'
import type { SetWhitelister } from './types'
import { vaultMulticall } from '../../../../contracts'


const setWhitelister: SetWhitelister = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

setWhitelister.encode = checkAccess<StakeWise.TransactionData>(setWhitelisterEncode)
setWhitelister.estimateGas = checkAccess<bigint>(setWhitelisterGas)


export default checkAccess<string>(setWhitelister)
