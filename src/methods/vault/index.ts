// Requests
import getVault from './requests/getVault'
import getExitQueue from './requests/getExitQueue'
import getValidators from './requests/getValidators'
import getUserRewards from './requests/getUserRewards'
import getDaySnapshots from './requests/getDaySnapshots'
import getStakeBalance from './requests/getStakeBalance'
import getWithdrawData from './requests/getWithdrawData'
import getHarvestParams from './requests/getHarvestParams'
import getAllocatorActions from './requests/getAllocatorActions'

// Transactions
import deposit from './transactions/deposit'
import withdraw from './transactions/withdraw'

// Transaction data
import depositData from './transactionData/depositData'
import withdrawData from './transactionData/withdrawData'


export default {
  requests: {
    getVault,
    getExitQueue,
    getValidators,
    getUserRewards,
    getDaySnapshots,
    getStakeBalance,
    getWithdrawData,
    getHarvestParams,
    getAllocatorActions,
  },
  transactions: {
    deposit,
    depositData,
    withdraw,
    withdrawData,
  },
} as const
