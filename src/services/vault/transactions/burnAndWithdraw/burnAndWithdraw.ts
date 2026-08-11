import { commonLogic } from './common'
import type { BurnAndWithdrawInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const burnAndWithdraw = async (values: BurnAndWithdrawInput) => {
  const multicallArgs = await commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default burnAndWithdraw
