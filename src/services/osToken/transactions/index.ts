import { transactionWrapper } from '../../../helpers'

import { createBurn, ExtractBurn } from './burn'
import { createMint, ExtractMint } from './mint'
import { createRedeemerWithdraw, ExtractRedeemerWithdraw } from './redeemerWithdraw'
import { createClaimRedeemerExitQueue, ExtractClaimRedeemerExitQueue } from './claimRedeemerExitQueue'


class OsTokenTransactions {
  /**
   * Getting osToken. The amount of token you can get depends on the user's current deposit in the vault.
   * Use data from methods osToken.getMaxMint and osToken.getHealthFactor to block a call to mint()
   * if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction
   * would make the position unhealthy
   * @see https://docs.stakewise.io/sdk/api/osToken/transactions/mint
   */
  public mint: ExtractMint

  /**
   * Burns your osToken
   * @see https://docs.stakewise.io/sdk/api/osToken/transactions/burn
   */
  public burn: ExtractBurn

  /**
   * Enters the OsTokenRedeemer exit queue with your osToken shares to redeem them for the underlying assets.
   * The osToken must be approved to the OsTokenRedeemer contract (or use a permit) before calling.
   * @see https://docs.stakewise.io/sdk/api/osToken/transactions/redeemerwithdraw
   */
  public redeemerWithdraw: ExtractRedeemerWithdraw

  /**
   * Claim user's OsTokenRedeemer exit queue.
   * @see https://docs.stakewise.io/sdk/api/osToken/transactions/claimredeemerexitqueue
   */
  public claimRedeemerExitQueue: ExtractClaimRedeemerExitQueue

  constructor(params: StakeWise.CommonParams) {
    this.mint = transactionWrapper(params, createMint(params))
    this.burn = transactionWrapper(params, createBurn(params))
    this.redeemerWithdraw = transactionWrapper(params, createRedeemerWithdraw(params))
    this.claimRedeemerExitQueue = transactionWrapper(params, createClaimRedeemerExitQueue(params))
  }
}


export default OsTokenTransactions
