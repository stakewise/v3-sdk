import { getRewards, GetRewardsInput } from './requests'
import DistributorRewardsTransactions from './transactions'


class DistributorRewards extends DistributorRewardsTransactions {
  readonly params: StakeWise.CommonParams

  constructor(params: StakeWise.CommonParams) {
    super(params)
    this.params = params
  }

  /**
   * @description Returns the set of distributor rewards tokens that are currently claimable.
   * @see https://docs.stakewise.io/distributorRewards/requests/getrewards
   */
  public getRewards(values: StakeWise.ExtractInput<GetRewardsInput>) {
    return getRewards({ ...this.params, ...values })
  }
}


export default DistributorRewards
