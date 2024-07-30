// Requests
import getVault from './requests/getVault'
import getEigenPods from './requests/getEigenPods'
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
import { default as create } from './transactions/create'
import { default as deposit } from './transactions/deposit'
import { default as operate } from './transactions/operate'
import { default as withdraw } from './transactions/withdraw'
import { default as claimExitQueue } from './transactions/claimExitQueue'
import { default as createEigenPod } from './transactions/createEigenPod'
import { default as setDepositDataRoot } from './transactions/setDepositDataRoot'
import { default as setEigenPodOperator } from './transactions/setEigenPodOperator'
import { default as setDepositDataManager } from './transactions/setDepositDataManager'
import { default as updateEigenPodOperator } from './transactions/updateEigenPodOperator'


export default {
  requests: {
    /**
     * @description Getting user's exit queue positions.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetexitqueuepositions
    */
    getExitQueuePositions,
    /**
     * @description This method is used to fetch information indicating the effectiveness
     * or performance level of the vault. The retrieved data includes percentiles corresponding to various statuses.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetscorepercentiles
    */
    getScorePercentiles,
    /**
     * @description Fetch the list of created reward splitters. A reward splitter is a contract
     * designed to distribute vault rewards among multiple fee recipients in predefined proportions.
     * To use a reward splitter, its address should be added to the vault as a fee recipient.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetrewardsplitters
    */
    getRewardSplitters,
    /**
     * @description Necessary to update the vault state.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetharvestparams
    */
    getHarvestParams,
    /**
     * @description Get a list of interactions with the vault.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetstakeractions
    */
    getStakerActions,
    /**
     * @description Getting user's balance in the vault.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetstakebalance
    */
    getStakeBalance,
    /**
     * @description Daily rewards for the user who has made a deposit in the vault.
     * With the help of this data it is possible to build a chart.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetuserrewards
    */
    getUserRewards,
    /**
     * @description How much a user can withdraw. Use this method if the user has mintedAssets,
     * if minted balance is null then maxWithdraw will be equal to stakedAssests.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetmaxwithdraw
    */
    getMaxWithdraw,
    /**
     * @description Returns the running vault validators.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetvalidators
    */
    getValidators,
    /**
     * @description Returns eigen pods for restake vault.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgeteigenpods
     */
    getEigenPods,
    /**
     * @description TVL and APY snapshots for the vault. With the help of this data it is possible to build a chart.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetsnapshots
    */
    getSnapshots,
    /**
     * @description Fetch the whitelist for private vaults. Only addresses included in
     * this list are eligible to stake in the private vault. The number of addresses in
     * this list is indicated by the vault whitelistCount field.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetwhitelist
    */
    getWhitelist,
    /**
     * @description Fetch the blocklist for blocklisted vaults. Addresses included in
     * this list are not eligible to stake in the blocklisted vault. The number of addresses
     * in this list is indicated by the vault blocklistCount field.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetblocklist
    */
    getBlocklist,
    /**
     * @description Returns the master data of the vault.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultgetvault
    */
    getVault,
  },
  transactions: {
    /**
     * @description Deposit (stake) in a vault.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultdeposit
    */
    deposit,
    /**
     * @description Withdrawal of funds from a vault.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultwithdraw
    */
    withdraw,
    /**
     * @description Take the freed tokens from the queue.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultclaimexitqueue
    */
    claimExitQueue,
    /**
     * @description Updates the vault by authorized personnel such as the vault admin, whitelist manager,
     * blocklist manager, validators manager, or deposit-data manager.
     * @throws Fields validatorsRoot and depositDataManager supported only first version of vaults
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultoperate
     */
    operate,
    /**
     * @description Create vault
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultcreate
     */
    create,
    /**
     * @description Adding root validators to vault
     * @throws Supports only the second version of vault
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultsetdepositdataroot
     */
    setDepositDataRoot,
    /**
     * @description Adding deposit data manager
     * @throws Supports only the second version of vault
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultsetdepositdatamanager
     */
    setDepositDataManager,
    /**
     * @description Adding eigen pod to the vault
     * @throws Supports only restake operators manager can perform this action
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultcreateeigenpod
     */
    createEigenPod,
    /**
     * @description Adding operator to the current eigen pod
     * @throws Supports only restake operators manager can perform this action
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultseteigenpodoperator
     */
    setEigenPodOperator,
    /**
     * @description Update operator to the current eigen pod
     * @throws Supports only restake operators manager can perform this action
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkvaultupdateeigenpodoperator
     */
    updateEigenPodOperator,
  },
} as const
