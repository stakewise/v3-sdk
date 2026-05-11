import { getFiatRates } from './getFiatRates'
import { getStakewiseStats } from './getStakewiseStats'
import { waitForSubgraph, WaitForSubgraphInput } from './waitForSubgraph'
import { getTransactions, GetTransactionsInput  } from './getTransactions'
import { getListVariables, GetListVariablesInput } from './getListVariables'
import { getFiatRatesByDay, GetFiatRatesByDayInput } from './getFiatRatesByDay'
import { getPermitSignature, GetPermitSignatureInput } from './getPermitSignature'
import { getVaultMulticallGas, GetVaultMulticallGas } from './getVaultMulticallGas'
import { getVaultMulticallEncode, GetVaultMulticallEncodeInput } from './getVaultMulticallEncode'


class Utils {
  readonly params: StakeWise.CommonParams

  constructor(params: StakeWise.CommonParams) {
    this.params = params
  }

  /**
   * @description Returns the USD, EUR, GBP, CNY, JPY, KRW, AUD, SWISE exchange rates for the current network asset
   * @see https://docs.stakewise.io/sdk/api/utils/getfiatrates
  */
  public getFiatRates() {
    return getFiatRates(this.params)
  }

  /**
   * @description TVL statistics, number of users, rewards earned
   * @see https://docs.stakewise.io/sdk/api/utils/getstakewisestats
  */
  public getStakewiseStats() {
    return getStakewiseStats(this.params)
  }

  /**
   * @description Retrieving a transaction to verify that the data went into the subgraph after the transaction
   * @see https://docs.stakewise.io/sdk/api/utils/gettransactions
  */
  public getTransactions(values: StakeWise.ExtractInput<GetTransactionsInput>) {
    return getTransactions({ ...this.params, ...values })
  }

  /**
   * @description Polls the subgraph until a transaction with the given hash is indexed. Required after every write before refetching reads.
   * @see https://docs.stakewise.io/sdk/api/utils/waitforsubgraph
  */
  public waitForSubgraph(values: StakeWise.ExtractInput<WaitForSubgraphInput>) {
    return waitForSubgraph({ ...this.params, ...values })
  }

  /**
   * @description Get fiat data by day
   * @see https://docs.stakewise.io/sdk/api/utils/getfiatratesbyday
  */
  public getFiatRatesByDay(values: StakeWise.ExtractInput<GetFiatRatesByDayInput>) {
    return getFiatRatesByDay({ ...this.params, ...values })
  }

  /**
   * @description Get permit signature (used in leverage staking).
   * @see https://docs.stakewise.io/sdk/api/utils/getpermitsignature
  */
  public getPermitSignature(values: StakeWise.ExtractInput<GetPermitSignatureInput>) {
    return getPermitSignature({ ...this.params, ...values })
  }

  public getVaultMulticallGas(values: StakeWise.ExtractInput<GetVaultMulticallGas>) {
    return getVaultMulticallGas({ ...this.params, ...values })
  }

  public getListVariables<T>(values: StakeWise.ExtractInput<GetListVariablesInput>) {
    return getListVariables<T>({ ...this.params, ...values })
  }

  public getVaultMulticallEncode(values: StakeWise.ExtractInput<GetVaultMulticallEncodeInput>) {
    return getVaultMulticallEncode({ ...this.params, ...values })
  }
}


export type {
  GetVaultMulticallEncodeInput,
  GetListVariablesInput,
  GetVaultMulticallGas,
}

export default Utils
