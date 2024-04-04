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
import getRewardSplitters from './requests/getRewardSplitters'
import getScorePercentiles from './requests/getScorePercentiles'
import getExitQueuePositions from './requests/getExitQueuePositions'

// Transactions
import { deposit } from './transactions/deposit'
import { withdraw } from './transactions/withdraw'
import { claimExitQueue } from './transactions/claimExitQueue'
import { updateWhitelist } from './transactions/updateWhitelist'
import { updateBlocklist } from './transactions/updateBlocklist'


export default {
  requests: {
    getExitQueuePositions,
    getScorePercentiles,
    getRewardSplitters,
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
    withdraw,
    claimExitQueue,
    /**
     * @deprecated soon to be changed to vault.operate
     */
    updateWhitelist,
    /**
     * @deprecated soon to be changed to vault.operate
     */
    updateBlocklist,
  },
} as const
