import { UnlockInput } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategyEncode from '../upgradeLeverageStrategy/upgradeLeverageStrategyEncode'


export type UnlockEncodeOutput = {
  unlockTxData: StakeWise.TransactionData
  upgradeLeverageStrategyTxData: StakeWise.TransactionData | null
}

const unlockEncode = async (values: UnlockInput): Promise<UnlockEncodeOutput> => {
  const { isUpgradeRequired, ...multicallArgs } = await commonLogic(values)

  const [
    unlockTxData,
    upgradeLeverageStrategyTxData,
  ] = await Promise.all([
    boostMulticall<{ data: string, to: string }>({
      ...multicallArgs,
      request: {
        ...multicallArgs.request,
        transactionData: true,
      },
    }),
    isUpgradeRequired
      ? upgradeLeverageStrategyEncode(values)
      : Promise.resolve(null),
  ])

  return {
    unlockTxData,
    upgradeLeverageStrategyTxData,
  }
}


export default unlockEncode
