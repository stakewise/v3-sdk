import checkAccess from './checkAccess'
import { commonLogic } from './common'
import updateBlocklistGas from './updateBlocklistGas'
import updateBlocklistEncode from './updateBlocklistEncode'
import { vaultMulticall } from '../../../../contracts'
import type { UpdateBlocklist } from './types'


const updateBlocklist: UpdateBlocklist = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateBlocklist.encode = checkAccess<StakeWise.TransactionData>(updateBlocklistEncode)
updateBlocklist.estimateGas = checkAccess<bigint>(updateBlocklistGas)


export default checkAccess<string>(updateBlocklist)
