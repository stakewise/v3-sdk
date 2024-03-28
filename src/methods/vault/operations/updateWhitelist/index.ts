import { commonLogic } from './common'
import checkAccess from './checkAccess'
import updateWhitelistGas from './updateWhitelistGas'
import updateWhitelistEncode from './updateWhitelistEncode'
import type { UpdateWhitelist } from './types'
import { vaultMulticall } from '../../../../contracts'


const updateWhitelist: UpdateWhitelist = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateWhitelist.encode = checkAccess<StakeWise.TransactionData>(updateWhitelistEncode)
updateWhitelist.estimateGas = checkAccess<bigint>(updateWhitelistGas)


export default checkAccess<string>(updateWhitelist)
