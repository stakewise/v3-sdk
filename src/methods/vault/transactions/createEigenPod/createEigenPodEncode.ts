import { commonLogic } from './common'
import { CreateEigenPodInput } from './types'


const depositEncode = async (values: CreateEigenPodInput) => {
  const contract = await commonLogic(values)

  const rx = await contract.createEigenPod.populateTransaction()

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default depositEncode
