import { commonLogic } from './common'
import type { SetClaimerInput } from './types'


const setClaimerEncode = async (values: SetClaimerInput) => {
  const { claimerAddress } = values

  const rewardSplitterContract = await commonLogic(values)

  return rewardSplitterContract.setClaimer.populateTransaction(claimerAddress)
}


export default setClaimerEncode
