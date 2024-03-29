// Requests
import getVault from './requests/getVault'
import getSnapshots from './requests/getSnapshots'
import getWhitelist from './requests/getWhitelist'
import getBlocklist from './requests/getBlocklist'
import getValidators from './requests/getValidators'
import getUserRewards from './requests/getUserRewards'
import getMaxWithdraw from './requests/getMaxWithdraw'
import getStakeBalance from './requests/getStakeBalance'
import getHarvestParams from './requests/getHarvestParams'
import getStakerActions from './requests/getStakerActions'
import getScorePercentiles from './requests/getScorePercentiles'
import getExitQueuePositions from './requests/getExitQueuePositions'

// Transactions
import { default as deposit } from './transactions/deposit'
import { default as operate } from './transactions/operate'
import { default as withdraw } from './transactions/withdraw'
import { default as claimExitQueue } from './transactions/claimExitQueue'


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
    getWhitelist,
    getBlocklist,
    getVault,
  },
  transactions: {
    deposit,
    operate,
    withdraw,
    claimExitQueue,
  },
} as const
