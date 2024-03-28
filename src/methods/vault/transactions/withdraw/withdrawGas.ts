import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { WithdrawInput } from './types'


type Input = WithdrawInput & {
  provider: StakeWise.Provider
}

const withdrawGas = async ({ provider, ...values }: Input) => {
  const multicallArgs = await commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default withdrawGas
