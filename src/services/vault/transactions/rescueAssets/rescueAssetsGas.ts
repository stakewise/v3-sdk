import Utils from '../../../utils'
import { commonLogic } from './common'
import type { RescueAssetsInput } from './types'


const rescueAssetsGas = async (values: RescueAssetsInput) => {
  const utils = new Utils(values)
  const multicallArgs = await commonLogic(values)

  return utils.getVaultMulticallGas(multicallArgs)
}


export default rescueAssetsGas
