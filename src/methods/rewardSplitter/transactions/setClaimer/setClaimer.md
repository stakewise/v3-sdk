---
id: setClaimer
slug: /rewardSplitter/transactions/setclaimer
---

#### Description:

Allows the reward splitter owner to set a claimer that can claim vault fees on behalf of the shareholders.

#### Arguments:
| Name                  | Type     | Required | Description                                                                                                                          |
|-----------------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| claimerAddress        | `string` | **Yes**  | The address of the claimer                                                                                                           |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter                                                                                                   |

#### Example:

```ts
const params = {
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
  claimerAddress: '0x...',
}

// Send transaction
const hash = await sdk.rewardSplitter.setClaimer(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.setClaimer.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.setClaimer.estimateGas(params)
```
