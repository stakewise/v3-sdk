// Requests
import getVault from './requests/getVault'
import getUserApy from './requests/getUserApy'
import getWhitelist from './requests/getWhitelist'
import getBlocklist from './requests/getBlocklist'
import getUserStats from './requests/getUserStats'
import getVaultStats from './requests/getVaultStats'
import getValidators from './requests/getValidators'
import getUserRewards from './requests/getUserRewards'
import getMaxWithdraw from './requests/getMaxWithdraw'
import getStakeBalance from './requests/getStakeBalance'
import getHarvestParams from './requests/getHarvestParams'
import getStakerActions from './requests/getStakerActions'
import getRewardSplitters from './requests/getRewardSplitters'
import getExitQueuePositions from './requests/getExitQueuePositions'

// Transactions
import { default as create } from './transactions/create'
import { default as deposit } from './transactions/deposit'
import { default as operate } from './transactions/operate'
import { default as withdraw } from './transactions/withdraw'
import { default as claimExitQueue } from './transactions/claimExitQueue'
import { default as setDepositDataRoot } from './transactions/setDepositDataRoot'
import { default as setDepositDataManager } from './transactions/setDepositDataManager'


export default {
  requests: {
    /**
     * @description Getting user's exit queue positions.
     * @see https://sdk.stakewise.io/vault/requests/getexitqueuepositions
    */
    getExitQueuePositions,
    /**
     * @description Fetch the list of created reward splitters. A reward splitter is a contract
     * designed to distribute vault rewards among multiple fee recipients in predefined proportions.
     * To use a reward splitter, its address should be added to the vault as a fee recipient.
     * @see https://sdk.stakewise.io/vault/requests/getrewardsplitters
    */
    getRewardSplitters,
    /**
     * @description Necessary to update the vault state.
     * @see https://sdk.stakewise.io/vault/requests/getharvestparams
    */
    getHarvestParams,
    /**
     * @description Get a list of interactions with the vault.
     * @see https://sdk.stakewise.io/vault/requests/getstakeractions
    */
    getStakerActions,
    /**
     * @description Getting user's balance in the vault.
     * @see https://sdk.stakewise.io/vault/requests/getstakebalance
    */
    getStakeBalance,
    /**
     * @description Daily rewards for the user who has made a deposit in the vault.
     * @see https://sdk.stakewise.io/vault/requests/getuserrewards
    */
    getUserRewards,
    /**
     * @description How much a user can withdraw. Use this method if the user has mintedAssets,
     * if minted balance is null then maxWithdraw will be equal to stakedAssests.
     * @see https://sdk.stakewise.io/vault/requests/getmaxwithdraw
    */
    getMaxWithdraw,
    /**
     * @description Returns the running vault validators.
     * @see https://sdk.stakewise.io/vault/requests/getvalidators
    */
    getValidators,
    /**
     * @description Fetch the whitelist for private vaults. Only addresses included in
     * this list are eligible to stake in the private vault. The number of addresses in
     * this list is indicated by the vault whitelistCount field.
     * @see https://sdk.stakewise.io/vault/requests/getwhitelist
    */
    getWhitelist,
    /**
     * @description Fetch the blocklist for blocklisted vaults. Addresses included in
     * this list are not eligible to stake in the blocklisted vault. The number of addresses
     * in this list is indicated by the vault blocklistCount field.
     * @see https://sdk.stakewise.io/vault/requests/getblocklist
    */
    getBlocklist,
    /**
     * @description Returns the master data of the vault.
     * @see https://sdk.stakewise.io/vault/requests/getvault
    */
    getVault,
    /**
     * @description Returns the vault stats collection. With the help of this data it is possible to build a chart.
     * @see https://sdk.stakewise.io/vault/requests/getvaultstats
     */
    getVaultStats,
    /**
     * @description Returns the user stats collection for current vault.
     * With the help of this data it is possible to build a chart.
     * @see https://sdk.stakewise.io/vault/requests/getuserstats
     */
    getUserStats,
    /**
     * @description Get the current APY of the user taking into account minting and boost.
     * @see https://sdk.stakewise.io/vault/requests/getuserapy
     */
    getUserApy,
  },
  transactions: {
    /**
     * @description Deposit (stake) in a vault.
     * @see https://sdk.stakewise.io/vault/transactions/deposit
    */
    deposit,
    /**
     * @description Withdrawal of funds from a vault.
     * @see https://sdk.stakewise.io/vault/transactions/withdraw
    */
    withdraw,
    /**
     * @description Take the freed tokens from the queue.
     * @see https://sdk.stakewise.io/vault/transactions/claimexitqueue
    */
    claimExitQueue,
    /**
     * @description Updates the vault by authorized personnel such as the vault admin, whitelist manager,
     * blocklist manager, validators manager, or deposit-data manager.
     * @throws Fields depositDataRoot and depositDataManager supported only first version of vaults
     * @see https://sdk.stakewise.io/vault/transactions/operate
     */
    operate,
    /**
     * @description Create vault
     * @see https://sdk.stakewise.io/vault/transactions/create
     */
    create,
    /**
     * @description Adding root validators to vault
     * @throws Supports only the second version of vault
     * @see https://sdk.stakewise.io/vault/transactions/setdepositdataroot
     */
    setDepositDataRoot,
    /**
     * @description Adding deposit data manager
     * @throws Supports only the second version of vault
     * @see https://sdk.stakewise.io/vault/transactions/setdepositdatamanager
     */
    setDepositDataManager,
  },
} as const
