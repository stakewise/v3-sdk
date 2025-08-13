---
id: create
slug: /distributorRewards/transactions/claim
---

### `claim`

#### Description:

Claims rewards from the merkle distributor V2 contract.


#### Arguments:
| Name              | Type       | Required | Description                                                                                                                            |
|-------------------|------------|----------|----------------------------------------------------------------------------------------------------------------------------------------|
| userAddress       | `string`   | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin   |
| proof             | `string[]` | **Yes**  | The Merkle tree proof. Get it from [sdk.distributorRewards.getRewards](/distributorRewards/requests/getrewards)                        |
| tokens            | `string[]` | **Yes**  | An array of addresses of the tokens. Get it from [sdk.distributorRewards.getRewards](/distributorRewards/requests/getrewards)          |
| cumulativeAmounts | `string[]` | **Yes**  | An array of cumulative amounts of the tokens. Get it from [sdk.distributorRewards.getRewards](/distributorRewards/requests/getrewards) |

#### Example:

```ts
const params = {
  userAddress: '0x...',
  proof: [
    '0x...',
    '0x...',
  ],
  tokens: [
    '0x...',
    '0x...',
  ],
  cumulativeAmounts: [
    '1000000000000000000',
    '2000000000000000000',
  ],
}

// Send transaction
const hash = await sdk.distributorRewards.claim(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.distributorRewards.claim.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.distributorRewards.claim.estimateGas(params)
```
