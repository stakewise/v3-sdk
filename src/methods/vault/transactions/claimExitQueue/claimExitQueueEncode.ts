import { commonLogic } from './common'
import { ClaimExitQueueInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const claimExitQueueEncode = async (values: ClaimExitQueueInput): Promise<StakeWise.TransactionData> => {
  const { params, multicallArgs } = await commonLogic(values)

  const rx = await vaultMulticall<{ data: string, to: string }>({
    ...multicallArgs,
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


export default claimExitQueueEncode
