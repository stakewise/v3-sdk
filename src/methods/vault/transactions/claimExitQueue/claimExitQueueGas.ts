import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import { ClaimExitQueueInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const claimExitQueueGas = async (values: ClaimExitQueueInput) => {
  const { params, multicallArgs } = await commonLogic(values)

  const estimatedGas = await vaultMulticall<bigint>({
    ...multicallArgs,
    request: {
      params,
      transactionData: true,
    },
  })

  const gas = await getGas({ estimatedGas, provider: values.provider })

  return gas
}


export default claimExitQueueGas
