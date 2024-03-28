import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { DepositInput } from '../types'


const depositGas = async ({ provider, ...values }: DepositInput) => {
  const multicallArgs = commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default depositGas