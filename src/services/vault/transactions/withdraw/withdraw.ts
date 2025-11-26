import { commonLogic } from './common'
import type { WithdrawInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const withdraw = async (values: WithdrawInput) => {
  const multicallArgs = await commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default withdraw
