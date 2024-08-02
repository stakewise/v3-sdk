import { commonLogic } from './common'
import type { UpdateEigenPodOperatorInput } from './types'
import { eigenPodOwnerMulticall } from '../../../../contracts'


const updateEigenPodOperatorEncode = async (values: UpdateEigenPodOperatorInput) => {
  const multicallArgs = await commonLogic(values)

  return eigenPodOwnerMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })
}


export default updateEigenPodOperatorEncode
