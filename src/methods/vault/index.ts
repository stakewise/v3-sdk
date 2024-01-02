// Requests
import getVault from './requests/getVault'
import getValidators from './requests/getValidators'
import getUserRewards from './requests/getUserRewards'
import getMaxWithdraw from './requests/getMaxWithdraw'
import getStakeBalance from './requests/getStakeBalance'
import getHarvestParams from './requests/getHarvestParams'
import getStakerActions from './requests/getStakerActions'
import getExitQueuePositions from './requests/getExitQueuePositions'
import getSnapshots from './requests/getSnapshots'
import getScoring from './requests/getScoring'

// Transactions
import { deposit } from './transactions/deposit'
import { withdraw } from './transactions/withdraw'
import { claimExitQueue } from './transactions/claimExitQueue'


export default {
  requests: {
    getVault,
    getValidators,
    getUserRewards,
    getMaxWithdraw,
    getStakeBalance,
    getHarvestParams,
    getStakerActions,
    getSnapshots,
    getScoring,
    getExitQueuePositions,
  },
  transactions: {
    deposit,
    withdraw,
    claimExitQueue,
  },
} as const
