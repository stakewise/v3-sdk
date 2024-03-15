import { commonLogic } from './common'
import { DepositInput } from '../types'
import { vaultMulticall } from '../../../../../contracts'


type DepositDataOutput = StakeWise.TransactionData & {
  value: bigint
}

const depositEncode = async (values: DepositInput): Promise<DepositDataOutput> => {
  const { multicallArgs } = commonLogic(values)

  const rx = await vaultMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })

  return {
    value: values.assets,
    data: rx.data,
    to: rx.to,
  }
}


export default depositEncode
