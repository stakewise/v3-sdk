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
} from './requests'

import {
  getBurnAmount,
  GetBurnAmountInput,

  getHealthFactor,
  GetHealthFactorInput,

  getBurnAmountForUnstake,
  GetBurnAmountForUnstakeInput,
} from './helpers'

import OsTokenTransactions from './transactions'


class OsToken extends OsTokenTransactions {
  readonly params: StakeWise.CommonParams

  constructor(params: StakeWise.CommonParams) {
    super(params)
    this.params = params
  }

  /**
   * @description Current osToken APY.
   * @see https://docs.stakewise.io/osToken/requests/getostokenapy
  */
  public getAPY() {
    return getAPY(this.params)
  }

  /**
   * @description Current osToken rate.
   * @see https://docs.stakewise.io/osToken/requests/getostokenrate
  */
  public getRate() {
    return getRate(this.params)
  }

  /**
   * @description Maximum number of **shares** for minting.
   * @deprecated Use new getMaxMintAmount method.
   * @see https://docs.stakewise.io/osToken/requests/getmaxmint
  */
  public getMaxMint(values: StakeWise.ExtractInput<GetMaxMintInput>) {
    return getMaxMint({ ...this.params, ...values })
  }

  /**
   * @description Maximum number of **shares** for minting.
   * @see https://docs.stakewise.io/osToken/requests/getmaxmintamount
  */
  public getMaxMintAmount(values: StakeWise.ExtractInput<GetMaxMintAmountInput>) {
    return getMaxMintAmount({ ...this.params, ...values })
  }

  /**
   * @description User position data
   * @deprecated Use osToken.getHealthFactor and osToken.getBalance
   * @see https://docs.stakewise.io/osToken/requests/getposition
  */
  public getPosition(values: StakeWise.ExtractInput<GetOsTokenPositionInput>) {
    return getPosition({ ...this.params, ...values })
  }

  /**
   * @description User osToken balance
   * @see https://docs.stakewise.io/osToken/helpers/getbalance
  */
  public getBalance(values: StakeWise.ExtractInput<GetOsTokenBalanceInput>) {
    return getBalance({ ...this.params, ...values })
  }

  /**
   * @description Convert ETH (assets) → osToken (shares)
   * @see https://docs.stakewise.io/osToken/requests/getsharesfromassets
  */
  public getSharesFromAssets(values: StakeWise.ExtractInput<GetSharesFromAssetsInput>) {
    return getSharesFromAssets({ ...this.params, ...values })
  }

  /**
   * @description Convert osToken (shares) → ETH (assets)
   * @see https://docs.stakewise.io/osToken/requests/getassetsfromshares
  */
  public getAssetsFromShares(values: StakeWise.ExtractInput<GetAssetsFromSharesInput>) {
    return getAssetsFromShares({ ...this.params, ...values })
  }

  /**
   * @description How many osToken burn do you need to make to withdraw all deposit.
   * @deprecated use new getBurnAmountForUnstake method
   * @see https://docs.stakewise.io/osToken/helpers/getburnamount
  */
  public getBurnAmount(values: StakeWise.ExtractInput<GetBurnAmountInput>) {
    return getBurnAmount({ ...this.params, ...values })
  }

  /**
   * @description Returns the amount of osToken to burn for full unstake.
   * @see https://docs.stakewise.io/osToken/helpers/getburnamountforunstake
  */
  public getBurnAmountForUnstake(values: StakeWise.ExtractInput<GetBurnAmountForUnstakeInput>) {
    return getBurnAmountForUnstake({ ...this.params, ...values })
  }

  /**
   * @description Get the health of osETH position
   * @see https://docs.stakewise.io/osToken/helpers/gethealthfactor
  */
  public getHealthFactor(values: StakeWise.ExtractInput<GetHealthFactorInput>) {
    return getHealthFactor({ ...this.params, ...values })
  }
}


export default OsToken
