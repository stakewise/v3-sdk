import {
  getData,
  GetBoostDataInput,

  getQueuePosition,
  GetQueuePositionInput,

  getLeverageStrategyData,
  GetLeverageStrategyDataInput,

  getLeverageStrategyProxy,
  GetLeverageStrategyProxyInput,
} from './requests'

import RewardSplitterTransactions from './transactions'


class RewardSplitter extends RewardSplitterTransactions {
  readonly params: StakeWise.CommonParams

  constructor(params: StakeWise.CommonParams) {
    super(params)
    this.params = params
  }

  /**
   * @description Get basic boost data for the user.
   * @see https://docs.stakewise.io/boost/requests/getdata
   */
  public getData(values: StakeWise.ExtractInput<GetBoostDataInput>) {
    return getData({ ...this.params, ...values })
  }

  /**
   * @description Get unlock position data.
   * @see https://docs.stakewise.io/boost/requests/getqueueposition
   */
  public getQueuePosition(values: StakeWise.ExtractInput<GetQueuePositionInput>) {
    return getQueuePosition({ ...this.params, ...values })
  }

  /**
   * @description Get Aave leverage strategy contract data
   * @see https://docs.stakewise.io/boost/requests/getleveragestrategydata
   */
  public getLeverageStrategyData(values: StakeWise.ExtractInput<GetLeverageStrategyDataInput>) {
    return getLeverageStrategyData({ ...this.params, ...values })
  }

  /**
   * @description Get Aave leverage strategy proxy contract address
   * @see https://docs.stakewise.io/boost/requests/getleveragestrategyproxy
   */
  public getLeverageStrategyProxy(values: StakeWise.ExtractInput<GetLeverageStrategyProxyInput>) {
    return getLeverageStrategyProxy({ ...this.params, ...values })
  }
}


export default RewardSplitter
