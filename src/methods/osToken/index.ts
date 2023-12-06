// Requests
import getAPY from './requests/getOsTokenAPY'
import getMaxMint from './requests/getMaxMint'
import getBaseData from './requests/getOsTokenData'
import getBurnAmount from './helpers/getBurnAmount'
import getPosition from './requests/getOsTokenPosition'
import getHealthFactor from './helpers/getHealthFactor'
import getSharesFromAssets from './requests/getSharesFromAssets'
import getAssetsFromShares from './requests/getAssetsFromShares'
import getAvgRewardsPerSecond from './requests/getAvgRewardsPerSecond'

// Transactions
import { mint } from './transactions/mint'
import { burn } from './transactions/burn'


export default {
  requests: {
    getAPY,
    getMaxMint,
    getBaseData,
    getPosition,
    getBurnAmount,
    getHealthFactor,
    getSharesFromAssets,
    getAssetsFromShares,
    getAvgRewardsPerSecond,
  },
  transactions: {
    mint,
    burn,
  },
} as const
