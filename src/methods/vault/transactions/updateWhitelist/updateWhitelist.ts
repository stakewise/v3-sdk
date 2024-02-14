import { UpdateWhitelist } from './types'
import { commonLogic } from './common'
import updateWhitelistGas from './updateWhitelistGas'
import updateWhitelistEncode from './updateWhitelistEncode'
import { vaultMulticall } from '../../../../contracts'


const updateWhitelist: UpdateWhitelist = async (values) => {
  const { params, multicallCommonArgs } = await commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>({
    ...multicallCommonArgs,
    request: {
      params,
    },
  })

  return result.hash
}

updateWhitelist.encode = updateWhitelistEncode
updateWhitelist.estimateGas = updateWhitelistGas


export default updateWhitelist
