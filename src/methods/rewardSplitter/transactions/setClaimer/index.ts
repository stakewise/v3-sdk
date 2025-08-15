import { commonLogic } from './common'
import setClaimerGas from './setClaimerGas'
import setClaimerEncode from './setClaimerEncode'
import type { SetClaimer } from './types'


const setClaimer: SetClaimer = async (values) => {
  const { claimerAddress } = values

  const rewardSplitterContract = await commonLogic(values)

  const result = await rewardSplitterContract.setClaimer(claimerAddress)

  return result.hash
}

setClaimer.encode = setClaimerEncode
setClaimer.estimateGas = setClaimerGas


export default setClaimer
