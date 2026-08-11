---
id: getUnstakeAmountForBurn
slug: /sdk/api/osToken/helpers/getunstakeamountforburn
description: Use the StakeWise SDK getUnstakeAmountForBurn helper to find how much can be unstaked by burning a given amount of osToken.
---

#### Description:

Returns how much can be unstaked if you burn `shares` of osToken. You get the vault shares to send to the exit queue and their value in underlying tokens.

The result never breaks the vault's LTV limit, so the burn and the exit can go in one transaction. If the position is already above the limit, the result is lowered to fit.

#### Arguments:
| Name         | Type     | Required | Description                       |
|--------------|----------|----------|-----------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault          |
| userAddress  | `string` | **Yes**  | The user address                  |
| shares       | `bigint` | **Yes**  | The amount of osToken to burn     |

#### Returns:

```ts
type Output = {
  receivedAssets: bigint
  exitQueueShares: bigint
}
```

#### Example:

```ts
const { exitQueueShares, receivedAssets } = await sdk.osToken.getUnstakeAmountForBurn({
  userAddress: '0x...',
  vaultAddress: '0x...',
  shares: 1000000000000000000n,
})
```
