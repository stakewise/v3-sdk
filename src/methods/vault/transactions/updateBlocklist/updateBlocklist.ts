import { UpdateBlocklist } from './types'
import { commonLogic } from './common'
import updateBlocklistGas from './updateBlocklistGas'
import updateBlocklistEncode from './updateBlocklistEncode'
import { vaultMulticall } from '../../../../contracts'


const updateBlocklist: UpdateBlocklist = async (values) => {
  const { params, multicallCommonArgs } = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>({
    ...multicallCommonArgs,
    request: {
      params,
    },
  })

  return result.hash
}

updateBlocklist.encode = updateBlocklistEncode
updateBlocklist.estimateGas = updateBlocklistGas


export default updateBlocklist
