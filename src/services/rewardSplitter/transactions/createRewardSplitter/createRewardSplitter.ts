import { commonLogic } from './common'
import type { CreateRewardSplitterInput } from './types'
import { sendWithGasMargin } from '../../../../helpers'
import { checkAccess } from '../../../vault/transactions/util'


const createRewardSplitter = checkAccess<CreateRewardSplitterInput>(async (values) => {
  const rewardSplitterFactory = await commonLogic(values)

  const result = await sendWithGasMargin(rewardSplitterFactory.createRewardSplitter, [ values.vaultAddress ])

  return result.hash
})


export default createRewardSplitter
