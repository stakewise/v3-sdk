// Requests
import getVault from './requests/getVault'
import getValidators from './requests/getValidators'
import getUserRewards from './requests/getUserRewards'
import getDaySnapshots from './requests/getDaySnapshots'
import getStakeBalance from './requests/getStakeBalance'
import getWithdrawData from './requests/getWithdrawData'
import getHarvestParams from './requests/getHarvestParams'
import getStakerActions from './requests/getStakerActions'
import getCollateralized from './requests/getCollateralized'
import getExitQueuePositions from './requests/getExitQueuePositions'

// Transactions
import { deposit } from './transactions/deposit'
import { withdraw } from './transactions/withdraw'
import { claimExitQueue } from './transactions/claimExitQueue'


export default {
  requests: {
    getVault,
    getValidators,
    getUserRewards,
    getDaySnapshots,
    getStakeBalance,
    getWithdrawData,
    getHarvestParams,
    getStakerActions,
    getCollateralized,
    getExitQueuePositions,
  },
  transactions: {
    deposit,
    withdraw,
    claimExitQueue,
  },
} as const
