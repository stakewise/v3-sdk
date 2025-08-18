import { UnlockInput } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategy from '../upgradeLeverageStrategy'


type Output = {
  unlockTxData: StakeWise.TransactionData
  upgradeLeverageStrategyTxData: StakeWise.TransactionData
}

const unlockEncode = async (values: UnlockInput): Promise<Output> => {
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
      ? upgradeLeverageStrategy.encode(values)
      : Promise.resolve(null)
  ])

  return {
    unlockTxData,
    upgradeLeverageStrategyTxData,
  }
}


export default unlockEncode
