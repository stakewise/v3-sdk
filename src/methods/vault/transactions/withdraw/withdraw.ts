import { Withdraw } from './types'
import { commonLogic } from './common'
import withdrawGas from './withdrawGas'
import withdrawEncode from './withdrawEncode'
import { vaultMulticall } from '../../../../contracts'


const withdraw: Withdraw = async (values) => {
  const { params, multicallCommonArgs } = await commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>({
    ...multicallCommonArgs,
    request: {
      params,
    },
  })

  return result.hash
}

withdraw.encode = withdrawEncode
withdraw.estimateGas = withdrawGas


export default withdraw
