---
id: claimRewards
slug: /rewardSplitter/transactions/claimrewards
---

#### Description:

Claims rewards from the reward splitter contract

#### Arguments:
| Name                  | Type     | Required | Description                                                                                                                          |
|-----------------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| vaultAddress          | `string` | **Yes**  | The address of the vault                                                                                                             |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter                                                                                                   |
| assets                | `bigint` | **Yes**  | The amount of assets to claim                                                                                                        |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
  assets: parseEther('100'),
}

// Send transaction
const hash = await sdk.rewardSplitter.claimRewards(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.claimRewards.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.claimRewards.estimateGas(params)
```
