import { commonLogic } from './common'
import { getGas } from '../../../../helpers'
import type { ClaimInput } from './types'


const claimGas = async (values: ClaimInput) => {
  const { provider } = values

  const { merkleDistributorV2, params } = await commonLogic(values)

  const estimatedGas = await merkleDistributorV2.claim.estimateGas(...params)

  return getGas({ estimatedGas, provider })
}


export default claimGas
