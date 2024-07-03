import { commonLogic } from './common'
import { getVaultMulticallGas } from '../../../../utils'
import type { DepositInput } from '../types'


const depositGas = async (values: DepositInput) => {
  const { provider } = values

  const multicallArgs = commonLogic(values)

  return getVaultMulticallGas({ ...multicallArgs, provider })
}


export default depositGas
