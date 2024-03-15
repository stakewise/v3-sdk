import nativeTokenDeposit from './nativeToken/deposit'
import otherTokenDeposit from './otherToken/deposit'
import { getNetworkTypes } from '../../../../utils'
import type { DepositInput } from './types'


const depositEncode = async (values: DepositInput) => {
  const { options } = values

  const { isEthereum } = getNetworkTypes(options)

  return isEthereum
    ? nativeTokenDeposit.encode(values)
    : otherTokenDeposit.encode(values)
}


export default depositEncode
