import { commonLogic } from './common'
import type { DepositInput } from '../types'
import { vaultMulticall } from '../../../../../contracts'


const deposit = async (values: DepositInput) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default deposit
