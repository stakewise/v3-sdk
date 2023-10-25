import { commonLogic } from './common'
import { WithdrawInput } from './types'
import { getGas } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


const withdrawGas = async (values: WithdrawInput) => {
  const { params, multicallCommonArgs } = await commonLogic(values)

  const estimatedGas = await vaultMulticall<bigint>({
    ...multicallCommonArgs,
    request: {
      estimateGas: true,
      params,
    },
  })

  const gas = await getGas({ estimatedGas, provider: values.provider })

  return gas
}


export default withdrawGas
