import { Withdraw } from './types'
import { commonLogic } from './common'
import withdrawGas from './withdrawGas'
import withdrawEncode from './withdrawEncode'
import { vaultMulticall } from '../../../../contracts'


const withdraw: Withdraw = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

withdraw.encode = withdrawEncode
withdraw.estimateGas = withdrawGas


export default withdraw
