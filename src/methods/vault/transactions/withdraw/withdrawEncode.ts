import { commonLogic } from './common'
import { WithdrawInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const withdrawEncode = async (values: WithdrawInput): Promise<StakeWise.TransactionData> => {
  const { params, multicallCommonArgs } = await commonLogic(values)

  const rx = await vaultMulticall<{ data: string, to: string }>({
    ...multicallCommonArgs,
    request: {
      params,
      transactionData: true,
    },
  })

  return {
    data: rx.data,
    to: rx.to,
  }
}


export default withdrawEncode
