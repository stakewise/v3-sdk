---
id: getAssetsFromShares
slug: /osToken/requests/getassetsfromshares
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
