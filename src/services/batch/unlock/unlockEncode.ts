import boostUnlockEncode from '../../boost/transactions/unlock/unlockEncode'
import type { UnlockBatchInput } from './types'


const unlockEncode = async (values: UnlockBatchInput): Promise<StakeWise.BatchData> => {
  const { unlockTxData, upgradeLeverageStrategyTxData } = await boostUnlockEncode(values)

  const calls = [
    upgradeLeverageStrategyTxData,
    unlockTxData,
  ].filter(Boolean) as StakeWise.BatchData['calls']

  return { calls }
}


export default unlockEncode
