import { LockInput } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


type Output = {
  lockTxData: StakeWise.TransactionData
  approveTxData: StakeWise.TransactionData | null
}

const lockEncode = async (values: LockInput): Promise<Output> => {
  const { multiSigData, multicallArgs } = await commonLogic(values)

  const [ lockTxData, approveTxData ] = await Promise.all([
    boostMulticall<{ data: string, to: string }>({
      ...multicallArgs,
      request: {
        ...multicallArgs.request,
        transactionData: true,
      },
    }),
    multiSigData
      ? multiSigData.contract.approve.populateTransaction(...multiSigData.approveArgs)
      : Promise.resolve(null),
  ])

  return {
    lockTxData,
    approveTxData,
  }
}


export default lockEncode
