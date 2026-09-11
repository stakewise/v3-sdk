import {
  getVault, GetVaultInput,
  getUserApy, GetUserApyInput,
  getSubVaults, GetSubVaultsInput,
  getWhitelist, GetWhitelistInput,
  getBlocklist, GetBlocklistInput,
  getUserStats, GetUserStatsInput,
  getValidators, GetValidatorsInput,
  getVaultStats, GetVaultStatsInput,
  getUserRewards, GetUserRewardsInput,
  getMaxWithdraw, GetMaxWithdrawInput,
  getStakeBalance, GetStakeBalanceInput,
  getVaultVersion, GetVaultVersionInput,
  getVaultFactory, GetVaultFactoryInput,
  getStakerActions, GetStakerActionsInput,
  getOsTokenConfig, GetOsTokenConfigInput,
  getHarvestParams, GetHarvestParamsInput,
  getStakerPosition, GetStakerPositionInput,
  getRewardSplitters, GetRewardSplittersInput,
  getAllocatorPosition, GetAllocatorPositionInput,
  getMaxWithdrawAmount, GetMaxWithdrawAmountInput,
  getExitQueuePositions, GetExitQueuePositionsInput,
  getPeriodicDistributions, GetPeriodicDistributionsInput,
} from './requests'

import VaultTransactions from './transactions'


class Vault extends VaultTransactions {
  readonly params: StakeWise.CommonParams

  constructor(params: StakeWise.CommonParams) {
    super(params)
    this.params = params
  }

  /**
   * Returns the master data of the vault.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getvault
   */
  public getVault(values: StakeWise.ExtractInput<GetVaultInput>) {
    return getVault({ ...this.params, ...values })
  }

  /**
   * Necessary to update the vault state.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getharvestparams
   */
  public getHarvestParams(values: StakeWise.ExtractInput<GetHarvestParamsInput>) {
    return getHarvestParams({ ...this.params, ...values })
  }

  /**
   * Getting user's exit queue positions.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getexitqueuepositions
   */
  public getExitQueuePositions(values: StakeWise.ExtractInput<GetExitQueuePositionsInput>) {
    return getExitQueuePositions({ ...this.params, ...values })
  }

  /**
   * Fetch the list of created reward splitters.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getrewardsplitters
   */
  public getRewardSplitters(values: StakeWise.ExtractInput<GetRewardSplittersInput>) {
    return getRewardSplitters({ ...this.params, ...values })
  }

  /**
   * Get a list of interactions with the vault.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getstakeractions
   */
  public getStakerActions(values: StakeWise.ExtractInput<GetStakerActionsInput>) {
    return getStakerActions({ ...this.params, ...values })
  }

  /**
   * Getting user's balance in the vault.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getstakebalance
   */
  public getStakeBalance(values: StakeWise.ExtractInput<GetStakeBalanceInput>) {
    return getStakeBalance({ ...this.params, ...values })
  }

  /**
   * Daily rewards for the user.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getuserrewards
   */
  public getUserRewards(values: StakeWise.ExtractInput<GetUserRewardsInput>) {
    return getUserRewards({ ...this.params, ...values })
  }

  /**
   * How much a user can withdraw. Deprecated.
   * @deprecated Use new getMaxWithdrawAmount method
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getmaxwithdraw
   */
  public getMaxWithdraw(values: StakeWise.ExtractInput<GetMaxWithdrawInput>) {
    return getMaxWithdraw({ ...this.params, ...values })
  }

  /**
   * Getting the vault current version.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getvaultversion
   */
  public getVaultVersion(values: StakeWise.ExtractInput<GetVaultVersionInput>) {
    return getVaultVersion({ ...this.params, ...values })
  }

  /**
   * Getting the factory to vault creation.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getvaultfactory
   */
  public getVaultFactory(values: StakeWise.ExtractInput<GetVaultFactoryInput>) {
    return getVaultFactory({ ...this.params, ...values })
  }

  /**
   * How much a user can withdraw.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getmaxwithdrawamount
   */
  public getMaxWithdrawAmount(values: StakeWise.ExtractInput<GetMaxWithdrawAmountInput>) {
    return getMaxWithdrawAmount({ ...this.params, ...values })
  }

  /**
   * Returns the running vault validators.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getvalidators
   */
  public getValidators(values: StakeWise.ExtractInput<GetValidatorsInput>) {
    return getValidators({ ...this.params, ...values })
  }

  /**
   * Fetch the whitelist for private vaults.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getwhitelist
   */
  public getWhitelist(values: StakeWise.ExtractInput<GetWhitelistInput>) {
    return getWhitelist({ ...this.params, ...values })
  }

  /**
   * Fetch the blocklist for blocklisted vaults.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getblocklist
   */
  public getBlocklist(values: StakeWise.ExtractInput<GetBlocklistInput>) {
    return getBlocklist({ ...this.params, ...values })
  }

  /**
   * Returns the vault stats collection.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getvaultstats
   */
  public getVaultStats(values: StakeWise.ExtractInput<GetVaultStatsInput>) {
    return getVaultStats({ ...this.params, ...values })
  }

  /**
   * Returns the user stats collection.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getuserstats
   */
  public getUserStats(values: StakeWise.ExtractInput<GetUserStatsInput>) {
    return getUserStats({ ...this.params, ...values })
  }

  /**
   * Get the current APY of the user.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getuserapy
   */
  public getUserApy(values: StakeWise.ExtractInput<GetUserApyInput>) {
    return getUserApy({ ...this.params, ...values })
  }

  /**
   * Estimate the user's APY and total staked assets in a vault after a pending action (stake, mint, burn, boost) via position deltas.
   * Pass zero deltas to reproduce the current position.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getallocatorposition
   */
  public getAllocatorPosition(values: StakeWise.ExtractInput<GetAllocatorPositionInput>) {
    return getAllocatorPosition({ ...this.params, ...values })
  }

  /**
   * Estimate the staker's net APY and total assets after a pending action (stake, mint, burn, boost) via position deltas.
   * Pass zero deltas to reproduce the current position.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getstakerposition
   */
  public getStakerPosition(values: StakeWise.ExtractInput<GetStakerPositionInput>) {
    return getStakerPosition({ ...this.params, ...values })
  }

  /**
   * Getting the periodic distribution of additional incentives.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getperiodicdistributions
   */
  public getPeriodicDistributions(values: StakeWise.ExtractInput<GetPeriodicDistributionsInput>) {
    return getPeriodicDistributions({ ...this.params, ...values })
  }

  /**
   * Returns osToken collateral parameters.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getostokenconfig
   */
  public getOsTokenConfig(values: StakeWise.ExtractInput<GetOsTokenConfigInput>) {
    return getOsTokenConfig({ ...this.params, ...values })
  }

  /**
   * Returns the list of sub vaults.
   * @see https://docs.stakewise.io/sdk/api/vault/requests/getsubvaults
   */
  public getSubVaults(values: StakeWise.ExtractInput<GetSubVaultsInput>) {
    return getSubVaults({ ...this.params, ...values })
  }
}


export default Vault
