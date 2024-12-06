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
     * @see https://sdk.stakewise.io/boost/requests/getdata
     */
    getData,
    /**
     * @description Get unlock position data.
     * @see https://sdk.stakewise.io/boost/requests/getqueueposition
     */
    getQueuePosition,
    /**
     * @description Get Aave leverage strategy proxy contract address
     * @see https://sdk.stakewise.io/boost/requests/getleveragestrategyproxy
     */
    getLeverageStrategyProxy,
  },
  transactions: {
    /**
     * @description Lock your osToken to increase apy
     * @see https://sdk.stakewise.io/boost/transactions/lock
     */
    lock,
    /**
     * @description Unlock your boosted osToken
     * @see https://sdk.stakewise.io/boost/transactions/unlock
     */
     unlock,
    /**
     * @description Claim your boosted osTokens and accumulated rewards
     * @see https://sdk.stakewise.io/boost/transactions/claimqueue
     */
     claimQueue,
  },
} as const
