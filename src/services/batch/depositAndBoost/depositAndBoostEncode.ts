import * as z from 'zod/mini'
import { ZeroAddress } from 'ethers'

import { parseArgs, schema } from '../../../helpers'
import { getDepositAndMintCalls } from '../helpers'
import getMaxMintAmount from '../../osToken/requests/getMaxMintAmount'
import getLeverageStrategyProxy from '../../boost/requests/getLeverageStrategyProxy'
import { getLeverageStrategyContract, validateLeverageStrategyData } from '../../boost/helpers'
import upgradeLeverageStrategyEncode from '../../boost/transactions/upgradeLeverageStrategy/upgradeLeverageStrategyEncode'
import type { DepositAndBoostInput } from './types'


const depositAndBoostEncode = async (values: DepositAndBoostInput): Promise<StakeWise.BatchData> => {
  const {
    contracts, assets, receiveShares, boostShares, leverageStrategyData,
    userAddress, vaultAddress, referrerAddress = ZeroAddress,
  } = values

  parseArgs(z.object({
    assets: schema.bigint,
    userAddress: schema.ethAddress,
    vaultAddress: schema.ethAddress,
    referrerAddress: schema.ethAddress,
    receiveShares: z.optional(schema.bigint),
    boostShares: z.optional(schema.bigint),
  }), { assets, userAddress, vaultAddress, referrerAddress, receiveShares, boostShares })

  if (leverageStrategyData) {
    validateLeverageStrategyData(leverageStrategyData)
  }

  const maxMintInput = {
    ...values,
    additionalStakedAssets: assets,
  }

  const [
    strategyProxy,
    { leverageStrategyContract, isUpgradeRequired },
    mintShares,
  ] = await Promise.all([
    getLeverageStrategyProxy(values),
    getLeverageStrategyContract(values),
    receiveShares !== undefined ? Promise.resolve(receiveShares) : getMaxMintAmount(maxMintInput),
  ])

  const boostAmount = boostShares ?? mintShares

  const [ depositAndMintCalls, approveTxData, lockTxData, upgradeLeverageStrategyTxData ] = await Promise.all([
    getDepositAndMintCalls({ ...values, osTokenShares: mintShares }),
    contracts.tokens.mintToken.approve.populateTransaction(strategyProxy, boostAmount),
    leverageStrategyContract.deposit.populateTransaction(vaultAddress, boostAmount, referrerAddress),
    isUpgradeRequired ? upgradeLeverageStrategyEncode(values) : Promise.resolve(null),
  ])

  const calls = [
    upgradeLeverageStrategyTxData,
    ...depositAndMintCalls,
    approveTxData,
    lockTxData,
  ].filter(Boolean) as StakeWise.BatchData['calls']

  return { calls }
}


export default depositAndBoostEncode
