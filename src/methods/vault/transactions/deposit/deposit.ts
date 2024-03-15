import nativeTokenDeposit from './nativeToken/deposit'
import otherTokenDeposit from './otherToken/deposit'
import { getNetworkTypes } from '../../../../utils'
import depositEncode from './depositEncode'
import type { Deposit } from './types'
import depositGas from './depositGas'


const deposit: Deposit = async (values) => {
  const { options } = values

  const { isEthereum } = getNetworkTypes(options)

  return isEthereum
    ? nativeTokenDeposit(values)
    : otherTokenDeposit(values)
}

deposit.encode = depositEncode
deposit.estimateGas = depositGas


export default deposit
