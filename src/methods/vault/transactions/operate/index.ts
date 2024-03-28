import checkAccess from './checkAccess'
import multicallGas from './multicallGas'
import { commonLogic } from './common'
import multicallEncode from './multicallEncode'
import type { Multicall } from './types'
import { vaultMulticall } from '../../../../contracts'


const operate: Multicall = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

operate.encode = checkAccess<StakeWise.TransactionData>(multicallEncode)
operate.estimateGas = checkAccess<bigint>(multicallGas)


export default checkAccess<string>(operate)
