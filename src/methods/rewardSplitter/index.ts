// Transactions
import { default as createRewardSplitter } from './transactions/createRewardSplitter'
import { default as updateFeeRecipients } from './transactions/updateFeeRecipients'


export default {
  transactions: {
    create: createRewardSplitter,
    updateFeeRecipients,
  },
} as const
