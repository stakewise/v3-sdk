import { commonLogic } from './common'
import type { WithdrawInput } from './types'
import { getVaultMulticallGas } from '../../../utils'


const withdrawGas = async (values: WithdrawInput) => {
  const { provider } = values

  const multicallArgs = await commonLogic(values)

  return getVaultMulticallGas({ ...multicallArgs, provider })
}


export default withdrawGas
