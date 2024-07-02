import { commonLogic } from './common'
import type { UpdateEigenPodOperatorInput } from './types'
import { eigenPodOwnerMulticall } from '../../../../contracts'


const updateEigenPodOperatorEncode = async (values: UpdateEigenPodOperatorInput) => {
  const multicallArgs = await commonLogic(values)

  const rx = await eigenPodOwnerMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })

  return {
    data: rx.data,
    to: rx.to,
  }
}


export default updateEigenPodOperatorEncode
