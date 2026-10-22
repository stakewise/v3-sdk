import { commonLogic } from './common'
import type { ClaimInput } from './types'
import { sendWithGasMargin } from '../../../../helpers'


const claim = async (values: ClaimInput) => {
  const { merkleDistributorV2, params } = await commonLogic(values)

  const result = await sendWithGasMargin(merkleDistributorV2.claim, params)

  return result.hash
}


export default claim
