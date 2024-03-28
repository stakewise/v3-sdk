import checkAccess from './checkAccess'
import multicallGas from './multicallGas'
import { commonLogic } from './common'
import multicallEncode from './multicallEncode'
import type { Multicall } from './types'
import { vaultMulticall } from '../../../../contracts'


const multicall: Multicall = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

multicall.encode = checkAccess<StakeWise.TransactionData>(multicallEncode)
multicall.estimateGas = checkAccess<bigint>(multicallGas)


export default checkAccess<string>(multicall)
