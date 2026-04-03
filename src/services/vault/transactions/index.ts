import { getNetworkTypes, transactionWrapper } from '../../../helpers'

import { createOperate, ExtractOperate } from './operate'
import { multicall, VaultMulticallInput } from './multicall'
import { createWithdraw, ExtractWithdraw } from './withdraw'
import { createVaultCreator, ExtractCreateVault } from './createVault'
import { createAddSubVault, ExtractAddSubVaultInput } from './addSubVault'
import { createUpdateState, ExtractUpdateStateInput } from './updateState'
import { createClaimExitQueue, ExtractClaimExitQueue } from './claimExitQueue'
import { createEjectSubVault, ExtractEjectSubVaultInput } from './ejectSubVault'
import { createRejectSubVault, ExtractRejectSubVaultInput } from './rejectSubVault'
import { createSetDepositDataRoot, ExtractSetDepositDataRoot } from './setDepositDataRoot'
import { createSetDepositDataManager, ExtractSetDepositDataManager } from './setDepositDataManager'
import { createNativeTokenDeposit, createOtherTokenDeposit, ExtractDeposit } from './deposit'


class VaultTransactions {
  readonly params: StakeWise.CommonParams

  /**
   * @description Deposit (stake) in a vault.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/deposit
  */
  public deposit: ExtractDeposit

  /**
   * @description Withdrawal of funds from a vault.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/withdraw
  */
  public withdraw: ExtractWithdraw

  /**
   * @description Create vault.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/create
  */
  public create: ExtractCreateVault

  /**
   * @description Updates the vault by authorized personnel such as the vault admin, whitelist manager,
   * blocklist manager, validators manager, or deposit-data manager.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/operate
  */
  public operate: ExtractOperate

  /**
   * @description Claim user's exit queue.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/claimexitqueue
  */
  public claimExitQueue: ExtractClaimExitQueue

  /**
   * @description Adding root validators to vault. Supports only vault v2.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/setdepositdataroot
  */
  public setDepositDataRoot: ExtractSetDepositDataRoot

  /**
   * @description Adding deposit data manager. Supports only vault v2.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/setdepositdatamanager
  */
  public setDepositDataManager: ExtractSetDepositDataManager

  /**
   * @description Adding new sub-vault. Supports only in metaVault.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/addsubvault
   */
  public addSubVault: ExtractAddSubVaultInput

  /**
   * @description Rejecting a sub-vault. Supports only in metaVault.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/rejectsubvault
   */
  public rejectSubVault: ExtractRejectSubVaultInput

  /**
   * @description Ejecting a sub-vault. Supports only in metaVault.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/ejectsubvault
   */
  public ejectSubVault: ExtractEjectSubVaultInput

  /**
   * @description Update a vault state.
   * @see https://docs.stakewise.io/sdk/api/vault/transactions/updatestate
   */
  public updateState: ExtractUpdateStateInput

  constructor(params: StakeWise.CommonParams) {
    this.params = params

    const { isEthereum } = getNetworkTypes(params.options)

    this.deposit = transactionWrapper(
      params,
      isEthereum
        ? createNativeTokenDeposit(params)
        : createOtherTokenDeposit(params)
    )

    this.operate = transactionWrapper(params, createOperate(params))
    this.withdraw = transactionWrapper(params, createWithdraw(params))
    this.create = transactionWrapper(params, createVaultCreator(params))
    this.updateState = transactionWrapper(params, createUpdateState(params))
    this.addSubVault = transactionWrapper(params, createAddSubVault(params))
    this.rejectSubVault = transactionWrapper(params, createRejectSubVault(params))
    this.ejectSubVault = transactionWrapper(params, createEjectSubVault(params))
    this.claimExitQueue = transactionWrapper(params, createClaimExitQueue(params))
    this.setDepositDataRoot = transactionWrapper(params, createSetDepositDataRoot(params))
    this.setDepositDataManager = transactionWrapper(params, createSetDepositDataManager(params))
  }

  /**
   * @description Assistant function for custom multi-query requests to the vault.
  */
  public multicall<T>(values: StakeWise.ExtractInput<VaultMulticallInput>) {
    return multicall<T>({ ...this.params, ...values })
  }
}


export default VaultTransactions
