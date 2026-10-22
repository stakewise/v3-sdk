import { commonLogic } from './common'
import type { SetClaimerInput } from './types'
import { sendWithGasMargin } from '../../../../helpers'


const setClaimer = async (values: SetClaimerInput) => {
const { claimerAddress } = values

  const rewardSplitterContract = await commonLogic(values)

  const result = await sendWithGasMargin(rewardSplitterContract.setClaimer, [ claimerAddress ])

  return result.hash
}


export default setClaimer
