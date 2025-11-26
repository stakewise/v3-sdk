import Utils from '../../../utils'
import { commonLogic } from './common'
import type { WithdrawInput } from './types'


const withdrawGas = async (values: WithdrawInput) => {
  const utils = new Utils(values)
  const multicallArgs = await commonLogic(values)

  return utils.getVaultMulticallGas(multicallArgs)
}


export default withdrawGas
