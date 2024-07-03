import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { ClaimRewardsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const claimRewardsGas = async (values: ClaimRewardsInput) => {
  const { provider } = values

  const multicallArgs = await commonLogic(values)

  const estimatedGas = await rewardSplitterMulticall<bigint>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      estimateGas: true,
    },
  })

  return getGas({ estimatedGas, provider })
}


export default claimRewardsGas
