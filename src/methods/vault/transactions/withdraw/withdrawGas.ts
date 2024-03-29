import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { WithdrawInput } from './types'


const withdrawGas = async (values: WithdrawInput) => {
  const { provider } = values

  const multicallArgs = await commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default withdrawGas
