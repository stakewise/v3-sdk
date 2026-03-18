---
id: getSharesFromAssets
slug: /sdk/api/osToken/requests/getsharesfromassets
description: Use the StakeWise SDK getSharesFromAssets method to convert an ETH amount to its equivalent osToken share value.
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
