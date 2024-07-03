import nativeTokenDeposit from './nativeToken/deposit'
import otherTokenDeposit from './otherToken/deposit'
import { getNetworkTypes } from '../../../../utils'
import type { DepositInput } from './types'


const depositGas = (values: DepositInput) => {
  const { options } = values

  const { isEthereum } = getNetworkTypes(options)

  return isEthereum
    ? nativeTokenDeposit.estimateGas(values)
    : otherTokenDeposit.estimateGas(values)
}


export default depositGas
