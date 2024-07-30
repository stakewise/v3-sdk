import { commonLogic } from './common'
import { CreateEigenPodInput } from './types'


const depositEncode = async (values: CreateEigenPodInput) => {
  const contract = await commonLogic(values)

  return contract.createEigenPod.populateTransaction()
}


export default depositEncode
