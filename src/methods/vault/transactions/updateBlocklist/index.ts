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

updateBlocklist.encode = updateBlocklistEncode
updateBlocklist.estimateGas = updateBlocklistGas


export default updateBlocklist
