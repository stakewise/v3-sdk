import { UpdateWhitelist } from './types'
import { commonLogic } from './common'
import updateWhitelistGas from './updateWhitelistGas'
import updateWhitelistEncode from './updateWhitelistEncode'
import { vaultMulticall } from '../../../../contracts'


const updateWhitelist: UpdateWhitelist = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateWhitelist.encode = updateWhitelistEncode
updateWhitelist.estimateGas = updateWhitelistGas


export default updateWhitelist
