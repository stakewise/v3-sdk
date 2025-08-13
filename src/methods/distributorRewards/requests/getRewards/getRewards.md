---
id: getRewards
slug: /distributorRewards/requests/getrewards
---

#### Description:

Returns the set of distributor rewards tokens that are currently claimable. 

#### Arguments:
| Name        | Type     | Required | Description                                |
|-------------|----------|----------|--------------------------------------------|
| userAddress | `string` | **Yes**  | The address of the user making the request |

#### Returns:

```ts
type Output =
  {
    proof: string[]
    tokens: string[]
    unclaimedAmounts: string[]
    cumulativeAmounts: string[]
  }
  | null
```

| Name                | Description                                                                                                                  |
|---------------------|------------------------------------------------------------------------------------------------------------------------------|
| `proof`             | The Merkle tree proof. Used in [sdk.distributorRewards.claim](/distributorRewards/transactions/claim)                        |
| `tokens`            | An array of addresses of the tokens. Used in [sdk.distributorRewards.claim](/distributorRewards/transactions/claim)          |
| `unclaimedAmounts`  | An array of unclaimed amounts of the tokens. A claim is available if at least one amount in the array is greater than zero.  |
| `cumulativeAmounts` | An array of cumulative amounts of the tokens. Used in [sdk.distributorRewards.claim](/distributorRewards/transactions/claim) |

#### Example:

```ts
const distributorRewards = await sdk.distributorRewards.getRewards({
  vaultAddress: '0x...',
})
```
