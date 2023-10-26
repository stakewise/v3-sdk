// Requests
import getVault from './requests/getVault'
import getExitQueue from './requests/getExitQueue'
import getValidators from './requests/getValidators'
import getUserRewards from './requests/getUserRewards'
import getDaySnapshots from './requests/getDaySnapshots'
import getStakeBalance from './requests/getStakeBalance'
import getWithdrawData from './requests/getWithdrawData'
import getHarvestParams from './requests/getHarvestParams'
import getCollateralized from './requests/getCollateralized'
import getAllocatorActions from './requests/getAllocatorActions'

// Transactions
import { mint } from './transactions/mint'
import { deposit } from './transactions/deposit'
import { withdraw } from './transactions/withdraw'


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
    getCollateralized,
    getAllocatorActions,
  },
  transactions: {
    mint,
    deposit,
    withdraw,
  },
} as const
