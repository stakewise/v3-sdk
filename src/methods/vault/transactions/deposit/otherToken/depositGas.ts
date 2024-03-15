import { commonLogic } from './common'
import type { DepositInput } from '../types'
import { getGas } from '../../../../../utils'
import { vaultMulticall } from '../../../../../contracts'


const depositGas = async (values: DepositInput) => {
  const { multicallArgs } = commonLogic(values)

  const estimatedGas = await vaultMulticall<bigint>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      estimateGas: true,
    },
  })

  const gas = await getGas({ estimatedGas, provider: values.provider })

  return gas
}


export default depositGas
