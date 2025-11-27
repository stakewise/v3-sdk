import { createBurn, ExtractBurn } from './burn'
import { createMint, ExtractMint } from './mint'


class OsTokenTransactions {
  /**
   * @description Getting osToken. The amount of token you can get depends on the user's current deposit in the vault.
   * Use data from methods osToken.getMaxMint and osToken.getHealthFactor to block a call to mint()
   * if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction
   * would make the position unhealthy
   * @see https://docs.stakewise.io/osToken/transactions/mint
  */
  public mint: ExtractMint

  /**
   * @description Burns your osToken
   * @see https://docs.stakewise.io/osToken/transactions/burn
  */
  public burn: ExtractBurn

  constructor(params: StakeWise.CommonParams) {
    this.mint = createMint(params)
    this.burn = createBurn(params)
  }
}


export default OsTokenTransactions
