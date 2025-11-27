import { commonLogic } from './common'
import type { ClaimRewardsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const claimRewardsEncode = async (values: ClaimRewardsInput) => {
  const multicallArgs = await commonLogic(values)

  return rewardSplitterMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })
}


export default claimRewardsEncode
