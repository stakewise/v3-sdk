---
id: getSharesFromAssets
slug: /osToken/requests/getsharesfromassets
---

#### Description:

Convert ETH to osToken

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
await sdk.osToken.getSharesFromAssets({ amount: 0n })
```
