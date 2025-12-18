import { commonLogic } from './common'
import type { ClaimInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const claim = async (values: ClaimInput) => {
  const { merkleDistributorV2, params } = await commonLogic(values)

  const result = await wrapErrorHandler(
    merkleDistributorV2.claim(...params),
    'transaction'
  )

  return result.hash
}


export default claim
