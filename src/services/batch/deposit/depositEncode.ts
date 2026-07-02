import * as z from 'zod/mini'
import { MaxUint256, ZeroAddress } from 'ethers'

import { createErc20Contract } from '../../../contracts'
import { parseArgs, schema, getNetworkTypes } from '../../../helpers'
import { createNativeTokenDeposit, createOtherTokenDeposit } from '../../vault/transactions/deposit'
import type { DepositBatchInput } from './types'


const depositEncode = async (values: DepositBatchInput): Promise<StakeWise.BatchData> => {
  const { config, provider, options, assets, userAddress, vaultAddress, referrerAddress = ZeroAddress } = values

  parseArgs(z.object({
    assets: schema.bigint,
    userAddress: schema.ethAddress,
    vaultAddress: schema.ethAddress,
    referrerAddress: schema.ethAddress,
  }), { assets, userAddress, vaultAddress, referrerAddress })

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
