import Utils from '../../../../utils'
import { commonLogic } from './common'
import type { DepositAndMintInput } from '../types'


const depositAndMintGas = async (values: DepositAndMintInput) => {
  const multicallArgs = commonLogic(values)

  const utils = new Utils(values)

  return utils.getVaultMulticallGas(multicallArgs)
}


export default depositAndMintGas
