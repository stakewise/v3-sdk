// Requests
import getStats from './requests/getStats'
import getAPY from './requests/getOsTokenAPY'
import getMaxMint from './requests/getMaxMint'
import getRate from './requests/getOsTokenRate'
import getPosition from './requests/getPosition'
import getBurnAmount from './helpers/getBurnAmount'
import getHealthFactor from './helpers/getHealthFactor'
import getPermitSignature from '../utils/getPermitSignature'
import getSharesFromAssets from './requests/getSharesFromAssets'
import getAssetsFromShares from './requests/getAssetsFromShares'

// Transactions
import { default as mint } from './transactions/mint'
import { default as burn } from './transactions/burn'


export default {
  requests: {
    /**
     * @description Current os token APY.
     * @see https://sdk.stakewise.io/osToken/requests/getostokenapy
    */
    getAPY,
    /**
     * @description Current os token rate.
     * @see https://sdk.stakewise.io/osToken/requests/getostokenrate
    */
    getRate,
    /**
     * @description Maximum number of **shares** for minting
     * @see https://sdk.stakewise.io/osToken/requests/getmaxmint
    */
    getMaxMint,
    /**
     * @description User position data
     * @see https://sdk.stakewise.io/osToken/requests/getposition
    */
    getPosition,
    /**
     * @description How many osToken burn do you need to make to withdraw all deposit.
     * @see https://sdk.stakewise.io/osToken/helpers/getburnamount
    */
    getBurnAmount,
    /**
     * @description Get the health of osETH position
     * @see https://sdk.stakewise.io/osToken/helpers/gethealthfactor
    */
    getHealthFactor,
    /**
     * @description Convert ETH (assets) to osToken (shares)
     * @see https://sdk.stakewise.io/osToken/requests/getsharesfromassets
    */
    getSharesFromAssets,
    /**
     * @description Convert osToken (shares) to ETH (assets)
     * @see https://sdk.stakewise.io/osToken/requests/getassetsfromshares
    */
    getAssetsFromShares,
    /**
     * @description Get permit signature for proxy strategy contract to spend the user's osToken in leverage staking
     * @see https://sdk.stakewise.io/utils/getpermitsignature
    */
    getPermitSignature,
    /**
     * @description Returns the osToken stats collection. With the help of this data it is possible to build a chart.
     * @see https://sdk.stakewise.io/osToken/requests/getstats
     */
    getStats,
  },
  transactions: {
    /**
     * @description Getting osToken. The amount of token you can get depends on the user's current deposit in the vault.
     * Use data from methods osToken.getMaxMint and osToken.getHealthFactor to block a call to mint()
     * if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction
     * would make the position unhealthy
     * @see https://sdk.stakewise.io/osToken/transactions/mint
    */
    mint,
    /**
     * @description Burns your osToken
     * @see https://sdk.stakewise.io/osToken/transactions/burn
    */
    burn,
  },
} as const
