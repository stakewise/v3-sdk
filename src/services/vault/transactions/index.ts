import { getNetworkTypes } from '../../../utils'

import { createOperate, ExtractOperate } from './operate'
import { createWithdraw, ExtractWithdraw } from './withdraw'
import { createVaultCreator, ExtractCreateVault } from './createVault'
import { createClaimExitQueue, ExtractClaimExitQueue } from './claimExitQueue'
import { createSetDepositDataRoot, ExtractSetDepositDataRoot } from './setDepositDataRoot'
import { createNativeTokenDeposit, createOtherTokenDeposit, ExtractDeposit } from './deposit'
import { createSetDepositDataManager, ExtractSetDepositDataManager } from './setDepositDataManager'


class VaultTransactions {
  /**
   * @description Deposit (stake) in a vault.
   * @see https://docs.stakewise.io/vault/transactions/deposit
  */
  public deposit: ExtractDeposit

  /**
   * @description Withdrawal of funds from a vault.
   * @see https://docs.stakewise.io/vault/transactions/withdraw
  */
  public withdraw: ExtractWithdraw

  /**
   * @description Create vault.
   * @see https://docs.stakewise.io/vault/transactions/create
  */
  public create: ExtractCreateVault

  /**
   * @description Updates the vault by authorized personnel such as the vault admin, whitelist manager,
   * blocklist manager, validators manager, or deposit-data manager.
   * @see https://docs.stakewise.io/vault/transactions/operate
  */
  public operate: ExtractOperate

  /**
   * @description Claim user's exit queue.
   * @see https://docs.stakewise.io/vault/transactions/claimexitqueue
  */
  public claimExitQueue: ExtractClaimExitQueue

  /**
   * @description Adding root validators to vault. Supports only vault v2.
   * @see https://docs.stakewise.io/vault/transactions/setdepositdataroot
  */
  public setDepositDataRoot: ExtractSetDepositDataRoot

  /**
   * @description Adding deposit data manager. Supports only vault v2.
   * @see https://docs.stakewise.io/vault/transactions/setdepositdatamanager
  */
  public setDepositDataManager: ExtractSetDepositDataManager


  constructor(params: StakeWise.CommonParams) {
    const { isEthereum } = getNetworkTypes(params.options)

    this.deposit = isEthereum
      ? createNativeTokenDeposit(params)
      : createOtherTokenDeposit(params)

    this.operate = createOperate(params)
    this.withdraw = createWithdraw(params)
    this.create = createVaultCreator(params)
    this.claimExitQueue = createClaimExitQueue(params)
    this.setDepositDataRoot = createSetDepositDataRoot(params)
    this.setDepositDataManager = createSetDepositDataManager(params)
  }
}


export default VaultTransactions
