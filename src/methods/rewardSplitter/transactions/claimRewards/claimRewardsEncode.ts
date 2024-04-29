import { commonLogic } from './common'
import type { ClaimRewardsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const claimRewardsEncode = async (values: ClaimRewardsInput) => {
  const multicallArgs = await commonLogic(values)

  const rx = await rewardSplitterMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })

  return {
    data: rx.data,
    to: rx.to,
  }
}


export default claimRewardsEncode
