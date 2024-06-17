// Requests
import getAPY from './requests/getOsTokenAPY'
import getRate from './requests/getOsTokenRate'
import getMaxMint from './requests/getMaxMint'
import getConfig from './requests/getOsTokenConfig'
import getBaseData from './requests/getOsTokenData'
import getBurnAmount from './helpers/getBurnAmount'
import getPosition from './requests/getOsTokenPosition'
import getHealthFactor from './helpers/getHealthFactor'
import getSharesFromAssets from './requests/getSharesFromAssets'
import getAssetsFromShares from './requests/getAssetsFromShares'
import getAvgRewardsPerSecond from './requests/getAvgRewardsPerSecond'

// Transactions
import { default as mint } from './transactions/mint'
import { default as burn } from './transactions/burn'


export default {
  requests: {
    /**
     * @description Current os token APY.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetapy
    */
    getAPY,
    /**
     * @description Current os token rate.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetrate
    */
    getRate,
    /**
     * @description os token ltvPercent and thresholdPercent for provided vault
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetconfig
    */
    getConfig,
    /**
     * @description Maximum number of **shares** for minting
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetmaxmint
    */
    getMaxMint,
    /**
     * @description Basic information on the token
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetbasedata
     * @deprecated use getConfig(vaultAddress) and getRate
     */
    getBaseData,
    /**
     * @description User position data
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetposition
    */
    getPosition,
    /**
     * @description How many osToken burn do you need to make to withdraw all deposit.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetburnamount
    */
    getBurnAmount,
    /**
     * @description Get the health of osETH position
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengethealthfactor
    */
    getHealthFactor,
    /**
     * @description Convert ETH (assets) to osToken (shares)
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetsharesfromassets
    */
    getSharesFromAssets,
    /**
     * @description Convert osToken (shares) to ETH (assets)
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetassetsfromshares
    */
    getAssetsFromShares,
    /**
     * @description osETH average rewards per second
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokengetavgrewardspersecond
    */
    getAvgRewardsPerSecond,
  },
  transactions: {
    /**
     * @description Getting osToken. The amount of token you can get depends on the user's current deposit in the vault.
     * Use data from methods osToken.getMaxMint and osToken.getHealthFactor to block a call to mint()
     * if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction
     * would make the position unhealthy
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokenmint
    */
    mint,
    /**
     * @description Burns your osToken
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkostokenburn
    */
    burn,
  },
} as const
