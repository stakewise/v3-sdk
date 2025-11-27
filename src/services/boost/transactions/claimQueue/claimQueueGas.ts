import { commonLogic } from './common'
import { getGas } from '../../../../helpers'
import type { ClaimQueueInput } from './types'
import { boostMulticall } from '../../../../contracts'


const claimQueueGas = async (values: ClaimQueueInput) => {
  const { provider } = values

  const multicallArgs = await commonLogic(values)

  const estimatedGas = await boostMulticall<bigint>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      estimateGas: true,
    },
  })

  return getGas({ estimatedGas, provider })
}


export default claimQueueGas
