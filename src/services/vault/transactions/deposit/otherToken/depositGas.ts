import Utils from '../../../../utils'
import { commonLogic } from './common'
import type { DepositInput } from '../types'


const depositGas = async (values: DepositInput) => {
  const multicallArgs = commonLogic(values)

  const utils = new Utils(values)
  return utils.getVaultMulticallGas(multicallArgs)
}


export default depositGas
