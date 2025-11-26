import type { MintInput } from './types'
import { commonLogic } from './common'
import Utils  from '../../../utils'


const mintGas = (values: MintInput) => {
  const utils = new Utils(values)
  const multicallArgs = commonLogic(values)

  return utils.getVaultMulticallGas(multicallArgs)
}


export default mintGas
