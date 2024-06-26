import { commonLogic } from './common'
import { CreateEigenPodInput } from './types'


const depositEncode = async (values: CreateEigenPodInput) => {
  const { vaultContract } = await commonLogic(values)

  const rx = await vaultContract.createEigenPod.populateTransaction()

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default depositEncode
