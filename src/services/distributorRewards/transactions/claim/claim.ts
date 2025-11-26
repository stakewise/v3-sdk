import { commonLogic } from './common'
import type { ClaimInput } from './types'


const claim = async (values: ClaimInput) => {
  const { merkleDistributorV2, params } = await commonLogic(values)

  const result = await merkleDistributorV2.claim(...params)

  return result.hash
}


export default claim
