import depositGas from './depositGas'
import depositEncode from './depositEncode'
import { commonLogic } from './common'
import type { Deposit } from '../types'
import { vaultMulticall } from '../../../../../contracts'


const deposit: Deposit = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

deposit.encode = depositEncode
deposit.estimateGas = depositGas


export default deposit
