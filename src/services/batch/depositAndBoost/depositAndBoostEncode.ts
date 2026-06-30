import { ZeroAddress } from 'ethers'

import { validateArgs } from '../../../helpers'
import { getDepositAndMintCalls } from '../helpers'
import getMaxMintAmount from '../../osToken/requests/getMaxMintAmount'
import getLeverageStrategyProxy from '../../boost/requests/getLeverageStrategyProxy'
import { getLeverageStrategyContract } from '../../boost/helpers'
import upgradeLeverageStrategyEncode from '../../boost/transactions/upgradeLeverageStrategy/upgradeLeverageStrategyEncode'
import type { DepositAndBoostInput } from './types'


const depositAndBoostEncode = async (values: DepositAndBoostInput): Promise<StakeWise.BatchData> => {
  const {
    contracts, assets, receiveShares, boostShares,
    userAddress, vaultAddress, referrerAddress = ZeroAddress,
  } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ userAddress, vaultAddress, referrerAddress })

  if (receiveShares !== undefined) {
    validateArgs.bigint({ receiveShares })
  }

  if (boostShares !== undefined) {
    validateArgs.bigint({ boostShares })
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
