import { commonLogic } from './common'
import type { ClaimInput } from './types'
import { handleContractError } from '../../../../helpers'


const claim = async (values: ClaimInput) => {
  const { merkleDistributorV2, params } = await commonLogic(values)

  const result = await handleContractError(
    merkleDistributorV2.claim(...params),
    'transaction'
  )

  return result.hash
}


export default claim
