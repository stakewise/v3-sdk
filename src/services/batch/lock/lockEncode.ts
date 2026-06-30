import boostLockEncode from '../../boost/transactions/lock/lockEncode'
import type { LockBatchInput } from './types'


const lockEncode = async (values: LockBatchInput): Promise<StakeWise.BatchData> => {
  const { lockTxData, approveTxData, upgradeLeverageStrategyTxData } = await boostLockEncode({ ...values, useApprove: true })

  const calls = [
    upgradeLeverageStrategyTxData,
    approveTxData,
    lockTxData,
  ].filter(Boolean) as StakeWise.BatchData['calls']

  return { calls }
}


export default lockEncode
