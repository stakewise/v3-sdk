import Utils from '../../../utils'
import { commonLogic } from './common'
import type { BurnAndWithdrawInput } from './types'


const burnAndWithdrawGas = async (values: BurnAndWithdrawInput) => {
  const utils = new Utils(values)
  const multicallArgs = await commonLogic(values)

  return utils.getVaultMulticallGas(multicallArgs)
}


export default burnAndWithdrawGas
