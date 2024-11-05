import { commonLogic } from './common'
import type { LockInput } from './types'
import { getGas } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'


const lockGas = async (values: LockInput) => {
  const { provider } = values

  const multicallArgs = await commonLogic({ ...values, mockPermitSignature: true })

  const estimatedGas = await boostMulticall<bigint>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      estimateGas: true,
    },
  })

  return getGas({ estimatedGas, provider })
}


export default lockGas
