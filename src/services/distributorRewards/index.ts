import { getRewards, getDistributorClaimedAmount, GetRewardsInput, GetDistributorClaimedAmountInput } from './requests'
import DistributorRewardsTransactions from './transactions'


class DistributorRewards extends DistributorRewardsTransactions {
  readonly params: StakeWise.CommonParams

  constructor(params: StakeWise.CommonParams) {
    super(params)
    this.params = params
  }

  /**
   * @description Returns the set of distributor rewards tokens that are currently claimable.
   * @see https://docs.stakewise.io/sdk/api/distributorRewards/requests/getrewards
   */
  public getRewards(values: StakeWise.ExtractInput<GetRewardsInput>) {
    return getRewards({ ...this.params, ...values })
  }

  /**
   * @description Returns the cumulative amount of a distributor reward token already claimed by a user.
   * @see https://docs.stakewise.io/sdk/api/distributorRewards/requests/getdistributorclaimedamount
   */
  public getDistributorClaimedAmount(values: StakeWise.ExtractInput<GetDistributorClaimedAmountInput>) {
    return getDistributorClaimedAmount({ ...this.params, ...values })
  }
}


export default DistributorRewards
