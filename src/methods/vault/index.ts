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
import { default as withdraw } from './transactions/withdraw'
import { default as claimExitQueue } from './transactions/claimExitQueue'

// Operations
import { default as setMetadata } from './operations/setMetadata'
import { default as setWhitelister } from './operations/setWhitelister'
import { default as setKeysManager } from './operations/setKeysManager'
import { default as updateWhitelist } from './operations/updateWhitelist'
import { default as updateBlocklist } from './operations/updateBlocklist'
import { default as setValidatorsRoot } from './operations/setValidatorsRoot'
import { default as setBlocklistManager } from './operations/setBlocklistManager'


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
    withdraw,
    claimExitQueue,
  },
  operations: {
    setMetadata,
    setWhitelister,
    setKeysManager,
    updateWhitelist,
    updateBlocklist,
    setValidatorsRoot,
    setBlocklistManager,
  },
} as const
