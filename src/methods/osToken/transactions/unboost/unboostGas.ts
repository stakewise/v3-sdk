import type { UnboostInput } from './types'
import { getGas } from '../../../../utils'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const unboostGas = async (values: UnboostInput) => {
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


export default unboostGas
