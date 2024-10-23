import type { BoostInput } from './types'
import { getGas } from '../../../../utils'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const boostGas = async (values: BoostInput) => {
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


export default boostGas
