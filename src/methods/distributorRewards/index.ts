// Requests
import { default as getRewards } from './requests/getRewards'

// Transactions
import { default as claim } from './transactions/claim'


export default {
  requests: {
    /**
     * @description Returns the set of distributor rewards tokens that are currently claimable.
     * @see https://docs.stakewise.io/distributorRewards/requests/getrewards
     */
    getRewards,
  },
  transactions: {
    /**
     * @description Claims rewards from the merkle distributor V2 contract.
     * @see https://docs.stakewise.io/distributorRewards/transactions/claim
     */
    claim,
  },
} as const
