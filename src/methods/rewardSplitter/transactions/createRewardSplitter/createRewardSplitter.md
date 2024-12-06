---
id: create
slug: /rewardSplitter/transactions/createrewardsplitter
---

### `create`

#### Description:

Creates a reward splitter contract to distribute vault rewards among multiple fee recipients in predefined proportions.
Subsequently, the address of the created reward splitter must be added to the vault as a fee recipient in order to
utilize it. Please note that only vault admin is permitted to perform this action.


#### Arguments:
| Name         | Type     | Required | Description                                                                                                                          |
|--------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| userAddress  | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| vaultAddress | `string` | **Yes**  | The address of the vault                                                                                                             |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.rewardSplitter.create(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.create.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.create.estimateGas(params)
```
