// Requests
import getAPY from './requests/getOsTokenAPY'
import getMaxMint from './requests/getMaxMint'
import getBalance from './requests/getBalance'
import getRate from './requests/getOsTokenRate'
import getPosition from './requests/getPosition'
import getBurnAmount from './helpers/getBurnAmount'
import getHealthFactor from './helpers/getHealthFactor'
import getMaxMintAmount from './requests/getMaxMintAmount'
import getPermitSignature from '../utils/getPermitSignature'
import getSharesFromAssets from './requests/getSharesFromAssets'
import getAssetsFromShares from './requests/getAssetsFromShares'
import getBurnAmountForUnstake from './helpers/getBurnAmountForUnstake'

// Transactions
import { default as mint } from './transactions/mint'
import { default as burn } from './transactions/burn'


export default {
  requests: {
    /**
     * @description Current os token APY.
     * @see https://docs.stakewise.io/osToken/requests/getostokenapy
    */
    getAPY,
    /**
     * @description Current os token rate.
     * @see https://docs.stakewise.io/osToken/requests/getostokenrate
    */
    getRate,
    /**
     * @description Maximum number of **shares** for minting
     * @deprecated Use new getMaxMintAmount method
     * @see https://docs.stakewise.io/osToken/requests/getmaxmint
    */
    getMaxMint,
    /**
     * @description Maximum number of **shares** for minting
     * @see https://docs.stakewise.io/osToken/requests/getmaxmintamount
    */
    getMaxMintAmount,
    /**
     * @description User position data
     * @deprecated Use osToken.getHealthFactor and osToken.getBalance methods
     * @see https://docs.stakewise.io/osToken/requests/getposition
    */
    getPosition,
    /**
     * @description User osToken balance
     * @see https://docs.stakewise.io/osToken/helpers/getbalance
    */
    getBalance,
    /**
     * @description How many osToken burn do you need to make to withdraw all deposit.
     * @deprecated use new getBurnAmountForUnstake method
     * @see https://docs.stakewise.io/osToken/helpers/getburnamount
    */
    getBurnAmount,
    /**
     * @description Returns the amount of osToken that must be burned to enable unstaking of all underlying tokens.
     * @see https://docs.stakewise.io/osToken/helpers/getburnamountforunstake
    */
    getBurnAmountForUnstake,
    /**
     * @description Get the health of osETH position
     * @see https://docs.stakewise.io/osToken/helpers/gethealthfactor
    */
    getHealthFactor,
    /**
     * @description Convert ETH (assets) to osToken (shares)
     * @see https://docs.stakewise.io/osToken/requests/getsharesfromassets
    */
    getSharesFromAssets,
    /**
     * @description Convert osToken (shares) to ETH (assets)
     * @see https://docs.stakewise.io/osToken/requests/getassetsfromshares
    */
    getAssetsFromShares,
    /**
     * @description Get permit signature for proxy strategy contract to spend the user's osToken in leverage staking
     * @see https://docs.stakewise.io/utils/getpermitsignature
    */
    getPermitSignature,
  },
  transactions: {
    /**
     * @description Getting osToken. The amount of token you can get depends on the user's current deposit in the vault.
     * Use data from methods osToken.getMaxMint and osToken.getHealthFactor to block a call to mint()
     * if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction
     * would make the position unhealthy
     * @see https://docs.stakewise.io/osToken/transactions/mint
    */
    mint,
    /**
     * @description Burns your osToken
     * @see https://docs.stakewise.io/osToken/transactions/burn
    */
    burn,
  },
} as const
