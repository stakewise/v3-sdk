import { transactionWrapper } from '../../../helpers'

import { createSetClaimer, ExtractSetClaimer } from './setClaimer'
import { createClaimRewards, ExtractClaimRewards } from './claimRewards'
import { createUpdateFeeRecipients, ExtractUpdateFeeRecipients } from './updateFeeRecipients'
import { createRewardSplitterCreator, ExtractCreateRewardSplitter } from './createRewardSplitter'


class RewardSplitterTransactions {
  /**
   * @description Allows the reward splitter owner to set a claimer
   * that can claim vault fees on behalf of the shareholders.
   * @see https://docs.stakewise.io/rewardSplitter/transactions/setclaimer
   */
  public setClaimer: ExtractSetClaimer

  /**
   * @description Claims rewards from the reward splitter contract.
   * @see https://docs.stakewise.io/rewardSplitter/transactions/claimrewards
   */
  public claimRewards: ExtractClaimRewards

  /**
   * @description Updates the reward splitter fee recipients and predefined fee splitting proportions.
   * Please note that only the vault admin, who is also the owner of the reward splitter, is permitted to perform this action.
   * @see https://docs.stakewise.io/rewardSplitter/transactions/updatefeerecipients
  */
  public updateFeeRecipients: ExtractUpdateFeeRecipients

   /**
   * @description Creates a reward splitter contract to distribute vault rewards among multiple fee
   * recipients in predefined proportions. Subsequently, the address of the created reward splitter
   * must be added to the vault as a fee recipient in order to utilize it. Please note that only vault
   * admin is permitted to perform this action.
   * @see https://docs.stakewise.io/rewardSplitter/transactions/createrewardsplitter
  */
  public create: ExtractCreateRewardSplitter

  constructor(params: StakeWise.CommonParams) {
    this.setClaimer = transactionWrapper(params, createSetClaimer(params))
    this.claimRewards = transactionWrapper(params, createClaimRewards(params))
    this.create = transactionWrapper(params, createRewardSplitterCreator(params))
    this.updateFeeRecipients = transactionWrapper(params, createUpdateFeeRecipients(params))
  }
}


export default RewardSplitterTransactions
