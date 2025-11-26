import {
  getVault, GetVaultInput,
  getUserApy, GetUserApyInput,
  getWhitelist, GetWhitelistInput,
  getBlocklist, GetBlocklistInput,
  getUserStats, GetUserStatsInput,
  getValidators, GetValidatorsInput,
  getVaultStats, GetVaultStatsInput,
  getUserRewards, GetUserRewardsInput,
  getMaxWithdraw, GetMaxWithdrawInput,
  getStakeBalance, GetStakeBalanceInput,
  getStakerActions, GetStakerActionsInput,
  getOsTokenConfig, GetOsTokenConfigInput,
  getHarvestParams, GetHarvestParamsInput,
  getRewardSplitters, GetRewardSplittersInput,
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
   * @description Returns the master data of the vault.
   * @see https://docs.stakewise.io/vault/requests/getvault
  */
  public getVault(values: StakeWise.ExtractInput<GetVaultInput>) {
    return getVault({ ...this.params, ...values })
  }

  /**
   * @description Necessary to update the vault state.
   * @see https://docs.stakewise.io/vault/requests/getharvestparams
  */
  public getHarvestParams(values: StakeWise.ExtractInput<GetHarvestParamsInput>) {
    return getHarvestParams({ ...this.params, ...values })
  }

  /**
   * @description Getting user's exit queue positions.
   * @see https://docs.stakewise.io/vault/requests/getexitqueuepositions
  */
  public getExitQueuePositions(values: StakeWise.ExtractInput<GetExitQueuePositionsInput>) {
    return getExitQueuePositions({ ...this.params, ...values })
  }

  /**
   * @description Fetch the list of created reward splitters.
   * @see https://docs.stakewise.io/vault/requests/getrewardsplitters
  */
  public getRewardSplitters(values: StakeWise.ExtractInput<GetRewardSplittersInput>) {
    return getRewardSplitters({ ...this.params, ...values })
  }

  /**
   * @description Get a list of interactions with the vault.
   * @see https://docs.stakewise.io/vault/requests/getstakeractions
  */
  public getStakerActions(values: StakeWise.ExtractInput<GetStakerActionsInput>) {
    return getStakerActions({ ...this.params, ...values })
  }

  /**
   * @description Getting user's balance in the vault.
   * @see https://docs.stakewise.io/vault/requests/getstakebalance
  */
  public getStakeBalance(values: StakeWise.ExtractInput<GetStakeBalanceInput>) {
    return getStakeBalance({ ...this.params, ...values })
  }

  /**
   * @description Daily rewards for the user.
   * @see https://docs.stakewise.io/vault/requests/getuserrewards
  */
  public getUserRewards(values: StakeWise.ExtractInput<GetUserRewardsInput>) {
    return getUserRewards({ ...this.params, ...values })
  }

  /**
   * @description How much a user can withdraw. Deprecated.
   * @deprecated Use new getMaxWithdrawAmount method
   * @see https://docs.stakewise.io/vault/requests/getmaxwithdraw
  */
  public getMaxWithdraw(values: StakeWise.ExtractInput<GetMaxWithdrawInput>) {
    return getMaxWithdraw({ ...this.params, ...values })
  }

  /**
   * @description How much a user can withdraw.
   * @see https://docs.stakewise.io/vault/requests/getmaxwithdrawamount
  */
  public getMaxWithdrawAmount(values: StakeWise.ExtractInput<GetMaxWithdrawAmountInput>) {
    return getMaxWithdrawAmount({ ...this.params, ...values })
  }

  /**
   * @description Returns the running vault validators.
   * @see https://docs.stakewise.io/vault/requests/getvalidators
  */
  public getValidators(values: StakeWise.ExtractInput<GetValidatorsInput>) {
    return getValidators({ ...this.params, ...values })
  }

  /**
   * @description Fetch the whitelist for private vaults.
   * @see https://docs.stakewise.io/vault/requests/getwhitelist
  */
  public getWhitelist(values: StakeWise.ExtractInput<GetWhitelistInput>) {
    return getWhitelist({ ...this.params, ...values })
  }

  /**
   * @description Fetch the blocklist for blocklisted vaults.
   * @see https://docs.stakewise.io/vault/requests/getblocklist
  */
  public getBlocklist(values: StakeWise.ExtractInput<GetBlocklistInput>) {
    return getBlocklist({ ...this.params, ...values })
  }

  /**
   * @description Returns the vault stats collection.
   * @see https://docs.stakewise.io/vault/requests/getvaultstats
  */
  public getVaultStats(values: StakeWise.ExtractInput<GetVaultStatsInput>) {
    return getVaultStats({ ...this.params, ...values })
  }

  /**
   * @description Returns the user stats collection.
   * @see https://docs.stakewise.io/vault/requests/getuserstats
  */
  public getUserStats(values: StakeWise.ExtractInput<GetUserStatsInput>) {
    return getUserStats({ ...this.params, ...values })
  }

  /**
   * @description Get the current APY of the user.
   * @see https://docs.stakewise.io/vault/requests/getuserapy
  */
  public getUserApy(values: StakeWise.ExtractInput<GetUserApyInput>) {
    return getUserApy({ ...this.params, ...values })
  }

  /**
   * @description Getting the periodic distribution of additional incentives.
   * @see https://docs.stakewise.io/vault/requests/getperiodicdistributions
  */
  public getPeriodicDistributions(values: StakeWise.ExtractInput<GetPeriodicDistributionsInput>) {
    return getPeriodicDistributions({ ...this.params, ...values })
  }

  /**
   * @description Returns osToken collateral parameters.
   * @see https://docs.stakewise.io/vault/requests/getostokenconfig
  */
  public getOsTokenConfig(values: StakeWise.ExtractInput<GetOsTokenConfigInput>) {
    return getOsTokenConfig({ ...this.params, ...values })
  }
}


export default Vault
