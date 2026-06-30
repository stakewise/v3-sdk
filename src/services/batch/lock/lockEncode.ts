import { MaxUint256 } from 'ethers'

import boostLockEncode from '../../boost/transactions/lock/lockEncode'
import type { LockBatchInput } from './types'


const lockEncode = async (values: LockBatchInput): Promise<StakeWise.BatchData> => {
  const { lockTxData, approveTxData, upgradeLeverageStrategyTxData } = await boostLockEncode({
    ...values,
    approveParams: { amount: MaxUint256 },
  })

  const calls = [
    upgradeLeverageStrategyTxData,
    approveTxData,
    lockTxData,
  ].filter(Boolean) as StakeWise.BatchData['calls']

  return { calls }
}


export default lockEncode
