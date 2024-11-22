---
id: getStakeBalance
slug: /vault/requests/getstakebalance
---

#### Description:

Getting user's balance in the vault

#### Arguments:

| Name         | Type     | Required |
|--------------|----------|----------|
| userAddress  | `string` | **Yes**  |
| vaultAddress | `string` | **Yes**  |

#### Returns:

```ts
type Output = {
  shares: bigint
  assets: bigint
}
```

| Name     | Description             |
|----------|-------------------------|
| `assets` | Balance in ETH          |

#### Example:

```ts
await sdk.vault.getStakeBalance({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
