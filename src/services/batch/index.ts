import { createLock, ExtractLockBatch } from './lock'
import { createUnlock, ExtractUnlockBatch } from './unlock'
import { createDeposit, ExtractDepositBatch } from './deposit'
import { createDepositAndMint, ExtractDepositAndMintBatch } from './depositAndMint'
import { createDepositAndBoost, ExtractDepositAndBoostBatch } from './depositAndBoost'


class Batch {

  /**
   * @description Deposit (stake) into a vault in a single transaction
   * @see https://docs.stakewise.io/sdk/api/batch/deposit
   */
  public deposit: ExtractDepositBatch

  /**
   * @description Deposit (stake) and mint osToken in a single transaction
   * @see https://docs.stakewise.io/sdk/api/batch/depositandmint
   */
  public depositAndMint: ExtractDepositAndMintBatch

  /**
   * @description Deposit (stake) and boost osToken in a single transaction
   * @see https://docs.stakewise.io/sdk/api/batch/depositandboost
   */
  public depositAndBoost: ExtractDepositAndBoostBatch

  /**
   * @description Boost your osToken in a single transaction
   * @see https://docs.stakewise.io/sdk/api/batch/lock
   */
  public lock: ExtractLockBatch

  /**
   * @description Unboost your osToken in a single transaction
   * @see https://docs.stakewise.io/sdk/api/batch/unlock
   */
  public unlock: ExtractUnlockBatch

  constructor(params: StakeWise.CommonParams) {
    this.deposit = createDeposit(params)
    this.depositAndMint = createDepositAndMint(params)
    this.depositAndBoost = createDepositAndBoost(params)
    this.lock = createLock(params)
    this.unlock = createUnlock(params)
  }
}


export default Batch
