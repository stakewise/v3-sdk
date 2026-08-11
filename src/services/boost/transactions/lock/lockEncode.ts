import { LockInput } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategyEncode from '../upgradeLeverageStrategy/upgradeLeverageStrategyEncode'


export type LockEncodeOutput = {
  lockTxData: StakeWise.TransactionData
  approveTxData: StakeWise.TransactionData | null
  upgradeLeverageStrategyTxData: StakeWise.TransactionData | null
}

const lockEncode = async (values: LockInput): Promise<LockEncodeOutput> => {
  const { approveData, multicallArgs, isUpgradeRequired } = await commonLogic(values)

  const [
    lockTxData,
    approveTxData,
    upgradeLeverageStrategyTxData,
  ] = await Promise.all([
    boostMulticall<{ data: string, to: string }>({
      ...multicallArgs,
      request: {
        ...multicallArgs.request,
        transactionData: true,
      },
    }),
    approveData
      ? approveData.contract.approve.populateTransaction(...approveData.approveArgs)
      : Promise.resolve(null),
    isUpgradeRequired
      ? upgradeLeverageStrategyEncode(values)
      : Promise.resolve(null),
  ])

  return {
    lockTxData,
    approveTxData,
    upgradeLeverageStrategyTxData,
  }
}


export default lockEncode
