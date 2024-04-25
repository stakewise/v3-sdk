// Requests
import { default as getClaimAmount } from './requests/getClaimAmount'

// Transactions
import { default as claimRewards } from './transactions/claimRewards'
import { default as createRewardSplitter } from './transactions/createRewardSplitter'
import { default as updateFeeRecipients } from './transactions/updateFeeRecipients'


export default {
  requests: {
    /**
     * @description Calculates the amount of assets that the user can claim from the reward splitter.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkrewardsplittergetclaimamount
     */
    getClaimAmount,
  },
  transactions: {
    /**
     * @description Creates a reward splitter contract to distribute vault rewards among multiple fee
     * recipients in predefined proportions. Subsequently, the address of the created reward splitter
     * must be added to the vault as a fee recipient in order to utilize it. Please note that only vault
     * admin is permitted to perform this action.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkrewardsplittercreate
    */
    create: createRewardSplitter,
    /**
     * @description Updates the reward splitter fee recipients and predefined fee splitting proportions.
     * Please note that only the vault admin, who is also the owner of the reward splitter, is permitted to perform this action.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkrewardsplitterupdatefeerecipients
    */
    updateFeeRecipients,
    /**
     * @description Claims rewards from the reward splitter contract.
     * @see https://github.com/stakewise/v3-sdk/?tab=readme-ov-file#sdkrewardsplitterclaimrewards
     */
    claimRewards,
  },
} as const
