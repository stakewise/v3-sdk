import { commonLogic } from './common'
import type { SetClaimerInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const setClaimer = async (values: SetClaimerInput) => {
const { claimerAddress } = values

  const rewardSplitterContract = await commonLogic(values)

  const result = await wrapErrorHandler(
    rewardSplitterContract.setClaimer(claimerAddress),
    'transaction'
  )

  return result.hash
}


export default setClaimer
