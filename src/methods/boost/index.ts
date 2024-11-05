// Requests
import getData from './requests/getData'
import getQueuePosition from './requests/getQueuePosition'
import getLeverageStrategyProxy from './requests/getLeverageStrategyProxy'

// Transactions
import { default as lock } from './transactions/lock'
import { default as unlock } from './transactions/unlock'
import { default as claimQueue } from './transactions/claimQueue'


export default {
  requests: {
    /**
     * @description Get basic boost data for the user.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkboostgetdata
     */
    getData,
    /**
     * @description Get unlock position data.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkboostgetqueueposition
     */
    getQueuePosition,
    /**
     * @description Get Aave leverage strategy proxy contract address
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkboostgetleveragestrategyproxy
     */
    getLeverageStrategyProxy,
  },
  transactions: {
    /**
     * @description Lock your osToken to increase apy
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkboostlock
     */
    lock,
    /**
     * @description Unlock your boosted osToken
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkboostunlock
     */
     unlock,
    /**
     * @description Claim your boosted osTokens and accumulated rewards
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkboostclaimqueue
     */
     claimQueue,
  },
} as const
