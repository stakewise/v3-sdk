import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { UpdateFeeRecipientsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const updateFeeRecipientsGas = async (values: UpdateFeeRecipientsInput) => {
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


export default updateFeeRecipientsGas
