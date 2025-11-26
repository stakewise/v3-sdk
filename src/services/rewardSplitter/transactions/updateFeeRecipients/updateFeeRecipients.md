---
id: updateFeeRecipients
slug: /rewardSplitter/transactions/updatefeerecipients
---

#### Description:

Updates the reward splitter fee recipients and predefined fee splitting proportions.
Please note that only the vault admin, who is also the owner of the reward splitter, is permitted to perform this action.


#### Arguments:

| Name                  | Type                                         | Required | Description                                                                                                                                                                                                                                                                                                |
|-----------------------|----------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| userAddress           | `string`                                     | **Yes**  | The address of the user initiating the action. It should be the vault admin, who is also the owner of the reward splitter.                                                                                                                                                                                 |
| vaultAddress          | `string`                                     | **Yes**  | The address of the vault                                                                                                                                                                                                                                                                                   |
| rewardSplitterAddress | `string`                                     | **Yes**  | The address of the reward splitter                                                                                                                                                                                                                                                                         |
| feeRecipients         | `Array<{ address: string, shares: bigint }>` | **Yes**  | The list of the vault fee recipients with their addresses and shares amount. For simplicity, we suggest setting the amount as a percentage converted to a BigInt value. For example, for 100% shares: `parseEther('100')`                                                                                  |
| oldFeeRecipients      | `Array<{ address: string, shares: bigint }>` | **No**   | The current list of the vault fee recipients that will be updated within this action. It is needed to calculate how many shares will be added or removed from each fee recipient. If not provided, it will be requested from the [sdk.vault.getRewardSplitters](/vault/requests/getrewardsplitters) action |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
  feeRecipients: [
    {
      address: '0x...1', // The fee for this address will be increased from 20% to 50%.
      shares: parseEther('50'),
    },
    {
      address: '0x...4', // This address will be added as a fee recipient with 50% fee distribution.
      shares: parseEther('50'),
    },
  ],
  oldFeeRecipients: [
    {
      address: '0x...1', // The fee for this address will be increased from 20% to 50%.
      shares: parseEther('20'),
    },
    {
      address: '0x...2', // This address will be removed from the fee recipients since it is not in the `feeRecipients` list.
      shares: parseEther('40'),
    },
    {
      address: '0x...3', // This address will also be removed from the fee recipients.
      shares: parseEther('40'),
    },
  ],
}

// Send transaction
const hash = await sdk.rewardSplitter.updateFeeRecipients(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.updateFeeRecipients.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.updateFeeRecipients.estimateGas(params)
```
