// Requests
import { default as getRewards } from './requests/getRewards'

// Transactions
import { default as claim } from './transactions/claim'


export default {
  requests: {
    /**
     * @description Calculates the amount of assets that the user can claim from the reward splitter.
     * @see https://sdk.stakewise.io/distributorRewards/requests/getrewards
     */
    getRewards,
  },
  transactions: {
    /**
     * @description Claims rewards from the merkle distributor V2 contract.
     * @see https://sdk.stakewise.io/distributorRewards/transactions/claim
     */
    claim,
  },
} as const
