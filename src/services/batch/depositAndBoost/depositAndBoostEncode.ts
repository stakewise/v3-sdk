import { validate } from './validate'
import { getDepositAndMintCalls } from '../helpers'
import getMaxMintAmount from '../../osToken/requests/getMaxMintAmount'
import getLeverageStrategyProxy from '../../boost/requests/getLeverageStrategyProxy'
import { getLeverageStrategyContract, validateLeverageStrategyData } from '../../boost/helpers'
import upgradeLeverageStrategyEncode from '../../boost/transactions/upgradeLeverageStrategy/upgradeLeverageStrategyEncode'
import type { DepositAndBoostInput } from './types'


const depositAndBoostEncode = async (values: DepositAndBoostInput): Promise<StakeWise.BatchData> => {
  const { contracts, leverageStrategyData } = values

  const { assets, vaultAddress, receiveShares, boostShares, referrerAddress } = validate(values)

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
