import { commonLogic } from './common'
import type { UnlockInput } from './types'
import { getGas } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'


const unlocktGas = async (values: UnlockInput) => {
  const { provider } = values

  const multicallArgs = commonLogic(values)

  const estimatedGas = await boostMulticall<bigint>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      estimateGas: true,
    },
  })

  return getGas({ estimatedGas, provider })
}


export default unlocktGas
