import {
  getAPY,
  getRate,

  getMaxMint,
  GetMaxMintInput,

  getMaxMintAmount,
  GetMaxMintAmountInput,

  getPosition,
  GetOsTokenPositionInput,

  getBalance,
  GetOsTokenBalanceInput,

  getSharesFromAssets,
  GetSharesFromAssetsInput,

  getAssetsFromShares,
  GetAssetsFromSharesInput,

  getRedeemerExitQueuePositions,
  GetRedeemerExitQueuePositionsInput,
} from './requests'

import {
  getBurnAmount,
  GetBurnAmountInput,

  getHealthFactor,
  GetHealthFactorInput,

  getBurnAmountForUnstake,
  GetBurnAmountForUnstakeInput,

  getUnstakeAmountForBurn,
  GetUnstakeAmountForBurnInput,
} from './helpers'

import OsTokenTransactions from './transactions'


class OsToken extends OsTokenTransactions {
  readonly params: StakeWise.CommonParams

  constructor(params: StakeWise.CommonParams) {
    super(params)
    this.params = params
  }

  /**
   * Current osToken APY.
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getostokenapy
   */
  public getAPY() {
    return getAPY(this.params)
  }

  /**
   * Current osToken rate.
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getostokenrate
   */
  public getRate() {
    return getRate(this.params)
  }

  /**
   * Maximum number of **shares** for minting.
   * @deprecated Use new getMaxMintAmount method.
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getmaxmint
   */
  public getMaxMint(values: StakeWise.ExtractInput<GetMaxMintInput>) {
    return getMaxMint({ ...this.params, ...values })
  }

  /**
   * Maximum number of **shares** for minting.
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getmaxmintamount
   */
  public getMaxMintAmount(values: StakeWise.ExtractInput<GetMaxMintAmountInput>) {
    return getMaxMintAmount({ ...this.params, ...values })
  }

  /**
   * User position data
   * @deprecated Use osToken.getHealthFactor and osToken.getBalance
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getposition
   */
  public getPosition(values: StakeWise.ExtractInput<GetOsTokenPositionInput>) {
    return getPosition({ ...this.params, ...values })
  }

  /**
   * User osToken balance
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getbalance
   */
  public getBalance(values: StakeWise.ExtractInput<GetOsTokenBalanceInput>) {
    return getBalance({ ...this.params, ...values })
  }

  /**
   * Getting user's OsTokenRedeemer exit queue positions.
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getredeemerexitqueuepositions
   */
  public getRedeemerExitQueuePositions(values: StakeWise.ExtractInput<GetRedeemerExitQueuePositionsInput>) {
    return getRedeemerExitQueuePositions({ ...this.params, ...values })
  }

  /**
   * Convert ETH (assets) → osToken (shares)
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getsharesfromassets
   */
  public getSharesFromAssets(values: StakeWise.ExtractInput<GetSharesFromAssetsInput>) {
    return getSharesFromAssets({ ...this.params, ...values })
  }

  /**
   * Convert osToken (shares) → ETH (assets)
   * @see https://docs.stakewise.io/sdk/api/osToken/requests/getassetsfromshares
   */
  public getAssetsFromShares(values: StakeWise.ExtractInput<GetAssetsFromSharesInput>) {
    return getAssetsFromShares({ ...this.params, ...values })
  }

  /**
   * How many osToken burn do you need to make to withdraw all deposit.
   * @deprecated use new getBurnAmountForUnstake method
   * @see https://docs.stakewise.io/sdk/api/osToken/helpers/getburnamount
   */
  public getBurnAmount(values: StakeWise.ExtractInput<GetBurnAmountInput>) {
    return getBurnAmount({ ...this.params, ...values })
  }

  /**
   * Returns the amount of osToken to burn to unstake - in full, or up to a specific amount when `assets` is passed.
   * @see https://docs.stakewise.io/sdk/api/osToken/helpers/getburnamountforunstake
   */
  public getBurnAmountForUnstake(values: StakeWise.ExtractInput<GetBurnAmountForUnstakeInput>) {
    return getBurnAmountForUnstake({ ...this.params, ...values })
  }

  /**
   * Returns how much can be unstaked with the collateral that burning the given amount of osToken unlocks.
   * @see https://docs.stakewise.io/sdk/api/osToken/helpers/getunstakeamountforburn
   */
  public getUnstakeAmountForBurn(values: StakeWise.ExtractInput<GetUnstakeAmountForBurnInput>) {
    return getUnstakeAmountForBurn({ ...this.params, ...values })
  }

  /**
   * Get the health of osETH position
   * @see https://docs.stakewise.io/sdk/api/osToken/helpers/gethealthfactor
   */
  public getHealthFactor(values: StakeWise.ExtractInput<GetHealthFactorInput>) {
    return getHealthFactor({ ...this.params, ...values })
  }
}


export default OsToken
