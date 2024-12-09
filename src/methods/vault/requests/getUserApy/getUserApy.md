---
id: getUserApy
slug: /vault/requests/getuserapy
---

#### Description:

Get the current APY of the user taking into account minting and boost

#### Arguments:

| Name   | Type     | Required | Description              |
|--------|----------|----------|--------------------------|
| userAddress  | `string` | **Yes**  | The address of the user |
| vaultAddress | `string` | **Yes**  | The address of the vault | 

#### Returns:

```ts
type Output = number
```

#### Example:

```ts
await sdk.vault.getUserApy({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
