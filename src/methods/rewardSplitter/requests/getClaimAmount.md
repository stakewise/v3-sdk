---
id: getClaimAmount
slug: /rewardSplitter/requests/getclaimamount
---

#### Description:

Calculates the amount of assets that the user can claim from the reward splitter.

#### Arguments:
| Name                  | Type     | Required | Description                                |
|-----------------------|----------|----------|--------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user making the request |
| vaultAddress          | `string` | **Yes**  | The address of the vault                   |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter         |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
const claimAmount = await sdk.rewardSplitter.getClaimAmount({
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
})
```
