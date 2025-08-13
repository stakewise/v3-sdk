import { commonLogic } from './common'
import type { ClaimInput } from './types'


const claimEncode = async (values: ClaimInput) => {
  const { merkleDistributorV2, params } = await commonLogic(values)

  return merkleDistributorV2.claim.populateTransaction(...params)
}


export default claimEncode
