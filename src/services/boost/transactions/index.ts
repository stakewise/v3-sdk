import { transactionWrapper } from '../../../helpers'

import { createLock, ExtractLock } from './lock'
import { createUnlock, ExtractUnlock } from './unlock'
import { createClaimQueue, ExtractClaimQueue } from './claimQueue'
import { createUpgradeLeverageStrategy, ExtractUpgradeLeverageStrategy } from './upgradeLeverageStrategy'


class BoostTransactions {

  /**
   * Lock your osToken to increase apy
   * @see https://docs.stakewise.io/sdk/api/boost/transactions/lock
   */
  public lock: ExtractLock

  /**
   * Unlock your boosted osToken
   * @see https://docs.stakewise.io/sdk/api/boost/transactions/unlock
   */
  public unlock: ExtractUnlock

  /**
   * Claim your boosted osTokens and accumulated rewards
   * @see https://docs.stakewise.io/sdk/api/boost/transactions/claimqueue
   */
  public claimQueue: ExtractClaimQueue

  /**
   * Upgrade leverage strategy contract version
   * @see https://docs.stakewise.io/sdk/api/boost/transactions/upgradeleveragestrategy
   */
  public upgradeLeverageStrategy: ExtractUpgradeLeverageStrategy

  constructor(params: StakeWise.CommonParams) {
    this.lock = transactionWrapper(params, createLock(params))
    this.unlock = transactionWrapper(params, createUnlock(params))
    this.claimQueue = transactionWrapper(params, createClaimQueue(params))
    this.upgradeLeverageStrategy = transactionWrapper(params, createUpgradeLeverageStrategy(params))
  }
}


export default BoostTransactions
