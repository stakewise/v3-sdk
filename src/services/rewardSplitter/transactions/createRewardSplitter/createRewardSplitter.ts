import { commonLogic } from './common'
import type { CreateRewardSplitterInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'
import { checkAccess } from '../../../vault/transactions/util'


const createRewardSplitter = checkAccess<CreateRewardSplitterInput>(async (values) => {
  const rewardSplitterFactory = await commonLogic(values)

  const result = await wrapErrorHandler(
    rewardSplitterFactory.createRewardSplitter(values.vaultAddress),
    'transaction'
  )

  return result.hash
})


export default createRewardSplitter
