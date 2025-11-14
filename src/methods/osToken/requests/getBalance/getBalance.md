---
id: getBalance
slug: /osToken/requests/getbalance
---

#### Description:

User osToken balance

#### Arguments:
| Name             | Type     | Required | Description                                                  |
|------------------|----------|----------|--------------------------------------------------------------|
| userAddress      | `string` | **Yes**  | The user address                                             |
| vaultAddress     | `string` | **Yes**  | The address of the vault                                     |

#### Returns:

```ts
type Output = {
  assets: bigint
  shares: bigint
}
```

| Name                 | Description                                                     |
|----------------------|-----------------------------------------------------------------|
| `shares`      | Balance                                                         |
| `assets`      | Balance in ETH                                                  |

#### Example:

```ts
await sdk.osToken.getBalance({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
