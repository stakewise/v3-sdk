---
id: getClaimAmount
slug: /rewardSplitter/requests/getclaimamount
---

#### Description:

Calculates the amount of assets that the user can claim from the reward splitter. The method response is divided into 2 parts, in “active” you get data on the current reward splitter, in “inactive” you get data on the ones you used before.

#### Arguments:
| Name                  | Type     | Required | Description                                |
|-----------------------|----------|----------|--------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user making the request |
| vaultAddress          | `string` | **Yes**  | The address of the vault                   |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter         |

#### Returns:

```ts
type Item = {
  assets: bigint
  address: string
}

type Output = {
  active: Item
  inactive: Array<Item>
}
```

#### Example:

```ts
const claimAmount = await sdk.rewardSplitter.getClaimAmount({
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
})
```
