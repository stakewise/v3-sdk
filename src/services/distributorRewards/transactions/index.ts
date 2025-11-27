import { createClaim, ExtractClaim } from './claim'


class DistributorRewardsTransactions {
  /**
   * @description Claims rewards from the merkle distributor V2 contract.
   * @see https://docs.stakewise.io/distributorRewards/transactions/claim
   */
  public claim: ExtractClaim

  constructor(params: StakeWise.CommonParams) {
    this.claim = createClaim(params)
  }
}


export default DistributorRewardsTransactions
