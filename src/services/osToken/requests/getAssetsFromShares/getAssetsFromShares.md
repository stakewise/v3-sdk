---
id: getAssetsFromShares
slug: /sdk/api/osToken/requests/getassetsfromshares
description: Use the StakeWise SDK getAssetsFromShares method to convert an osToken share amount to its equivalent ETH value.
---

#### Description:

Convert osToken to ETH

#### Arguments:

| Name | Type | Required |
|------|------|-------------|
| amount | `bigint` | **Yes** |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
await sdk.osToken.getAssetsFromShares({ amount: 0n })
```
