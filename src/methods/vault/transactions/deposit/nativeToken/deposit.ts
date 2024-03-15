<<<<<<<< HEAD:src/methods/vault/transactions/deposit/nativeToken/deposit.ts
import depositGas from './depositGas'
import type { Deposit } from '../types'
import depositEncode from './depositEncode'
import { commonLogic, referrer } from './common'
import getHarvestParams from '../../../requests/getHarvestParams'
========
import nativeTokenDeposit from './nativeToken/deposit'
import otherTokenDeposit from './otherToken/deposit'
import { getNetworkTypes } from '../../../../utils'
import depositEncode from './depositEncode'
import type { Deposit } from './types'
import depositGas from './depositGas'
>>>>>>>> 1f5684d (Add Chiado network & change deposit logic (#79)):src/methods/vault/transactions/deposit/deposit.ts


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
