import { createLock, ExtractLock } from './lock'
import { createUnlock, ExtractUnlock } from './unlock'
import { createClaimQueue, ExtractClaimQueue } from './claimQueue'
import { createUpgradeLeverageStrategy, ExtractUpgradeLeverageStrategy } from './upgradeLeverageStrategy'


class BoostTransactions {

  /**
   * @description Lock your osToken to increase apy
   * @see https://docs.stakewise.io/boost/transactions/lock
   */
  public lock: ExtractLock

  /**
   * @description Unlock your boosted osToken
   * @see https://docs.stakewise.io/boost/transactions/unlock
   */
  public unlock: ExtractUnlock

  /**
   * @description Claim your boosted osTokens and accumulated rewards
   * @see https://docs.stakewise.io/boost/transactions/claimqueue
   */
  public claimQueue: ExtractClaimQueue

  /**
   * @description Upgrade leverage strategy contract version
   * @see https://docs.stakewise.io/boost/transactions/upgradeleveragestrategy
   */
  public upgradeLeverageStrategy: ExtractUpgradeLeverageStrategy

  constructor(params: StakeWise.CommonParams) {
    this.lock = createLock(params)
    this.unlock = createUnlock(params)
    this.claimQueue = createClaimQueue(params)
    this.upgradeLeverageStrategy = createUpgradeLeverageStrategy(params)
  }
}


export default BoostTransactions
