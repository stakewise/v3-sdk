import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { Multicall } from './types'
import multicallGas from './multicallGas'
import multicallEncode from './multicallEncode'
import { vaultMulticall } from '../../../../contracts'


const operate: Multicall = async (values) => {
  const multicallCommonArgs = await commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

operate.encode = checkAccess<StakeWise.TransactionData>(multicallEncode)
operate.estimateGas = checkAccess<bigint>(multicallGas)


export default checkAccess<string>(operate) as Multicall
