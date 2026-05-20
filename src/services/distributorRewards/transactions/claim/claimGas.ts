import { commonLogic } from './common'
import type { ClaimInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const claimGas = async (values: ClaimInput) => {
  const { provider } = values

  const { merkleDistributorV2, params } = await commonLogic(values)

  const estimatedGas = await wrapErrorHandler(
    merkleDistributorV2.claim.estimateGas(...params),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default claimGas
