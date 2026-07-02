import { MaxUint256 } from 'ethers'

import { validate } from './validate'
import { createErc20Contract } from '../../../contracts'
import { getNetworkTypes } from '../../../helpers'
import { createNativeTokenDeposit, createOtherTokenDeposit } from '../../vault/transactions/deposit'
import type { DepositBatchInput } from './types'


const depositEncode = async (values: DepositBatchInput): Promise<StakeWise.BatchData> => {
  const { config, provider, options } = values

  const { assets, userAddress, vaultAddress } = validate(values)

  const { isEthereum } = getNetworkTypes(options)

  const createDeposit = isEthereum ? createNativeTokenDeposit : createOtherTokenDeposit
  const depositTxData = await createDeposit(values).encode(values)

  if (isEthereum) {
    return { calls: [ depositTxData ] as StakeWise.BatchData['calls'] }
  }

  const depositTokenContract = createErc20Contract(config.addresses.tokens.depositToken, provider)
  const allowance = await depositTokenContract.allowance(userAddress, vaultAddress)

  const approveTxData = allowance < assets
    ? await depositTokenContract.approve.populateTransaction(vaultAddress, MaxUint256)
    : null

  const calls = [
    approveTxData,
    depositTxData,
  ].filter(Boolean) as StakeWise.BatchData['calls']

  return { calls }
}


export default depositEncode
