// Requests
import getVault from './requests/getVault'
import getSnapshots from './requests/getSnapshots'
import getValidators from './requests/getValidators'
import getUserRewards from './requests/getUserRewards'
import getMaxWithdraw from './requests/getMaxWithdraw'
import getStakeBalance from './requests/getStakeBalance'
import getHarvestParams from './requests/getHarvestParams'
import getStakerActions from './requests/getStakerActions'
import getScorePercentiles from './requests/getScorePercentiles'
import getExitQueuePositions from './requests/getExitQueuePositions'

// Transactions
import { deposit } from './transactions/deposit'
import { withdraw } from './transactions/withdraw'
import { claimExitQueue } from './transactions/claimExitQueue'


export default {
  requests: {
    getExitQueuePositions,
    getScorePercentiles,
    getHarvestParams,
    getStakerActions,
    getStakeBalance,
    getUserRewards,
    getMaxWithdraw,
    getValidators,
    getSnapshots,
    getVault,
  },
  transactions: {
    deposit,
    withdraw,
    claimExitQueue,
  },
} as const
