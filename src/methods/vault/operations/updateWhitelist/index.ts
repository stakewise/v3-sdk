import checkAccess from './checkAccess'
import { commonLogic } from './common'
import type { UpdateWhitelist } from './types'
import updateWhitelistGas from './updateWhitelistGas'
import updateWhitelistEncode from './updateWhitelistEncode'
import { vaultMulticall } from '../../../../contracts'


const updateWhitelist: UpdateWhitelist = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateWhitelist.encode = checkAccess<Stakewise.TransactionData>(updateWhitelistEncode)
updateWhitelist.estimateGas = checkAccess<bigint>(updateWhitelistGas)


export default checkAccess<string>(updateWhitelist)
