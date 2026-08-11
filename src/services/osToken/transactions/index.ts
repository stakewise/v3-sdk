import { transactionWrapper } from '../../../helpers'

import { createBurn, ExtractBurn } from './burn'
import { createMint, ExtractMint } from './mint'
import { createEnterExitQueue, ExtractEnterExitQueue } from './enterExitQueue'
import { createClaimExitedAssets, ExtractClaimExitedAssets } from './claimExitedAssets'


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
   * @see https://docs.stakewise.io/sdk/api/osToken/transactions/enterexitqueue
   */
  public enterExitQueue: ExtractEnterExitQueue

  /**
   * Claims the assets that have exited the OsTokenRedeemer queue for a given position ticket.
   * @see https://docs.stakewise.io/sdk/api/osToken/transactions/claimexitedassets
   */
  public claimExitedAssets: ExtractClaimExitedAssets

  constructor(params: StakeWise.CommonParams) {
    this.mint = transactionWrapper(params, createMint(params))
    this.burn = transactionWrapper(params, createBurn(params))
    this.enterExitQueue = transactionWrapper(params, createEnterExitQueue(params))
    this.claimExitedAssets = transactionWrapper(params, createClaimExitedAssets(params))
  }
}


export default OsTokenTransactions
