import { commonLogic } from './common'
import type { CreateRewardSplitter } from './types'
import claimGas from './claimGas'
import claimEncode from './claimEncode'


const claim: CreateRewardSplitter = async (values) => {
  const { merkleDistributorV2, params } = await commonLogic(values)

  const result = await merkleDistributorV2.claim(...params)

  return result.hash
}

claim.encode = claimEncode
claim.estimateGas = claimGas


export default claim
