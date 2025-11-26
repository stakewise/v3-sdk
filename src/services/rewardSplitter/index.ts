import { getClaimAmount, GetClaimAmountInput } from './requests'

import RewardSplitterTransactions from './transactions'


class RewardSplitter extends RewardSplitterTransactions {
  readonly params: StakeWise.CommonParams

  constructor(params: StakeWise.CommonParams) {
    super(params)
    this.params = params
  }

  /**
   * @description Calculates the amount of assets that the user can claim from the reward splitter.
   * @see https://docs.stakewise.io/rewardSplitter/requests/getclaimamount
   */
  public getClaimAmount(values: StakeWise.ExtractInput<GetClaimAmountInput>) {
    return getClaimAmount({ ...this.params, ...values })
  }
}


export default RewardSplitter
