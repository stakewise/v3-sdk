---
id: getUserApy
slug: sdk/api/vault/requests/getuserapy
description: Use the StakeWise SDK getUserApy method to get a user's current APY in a vault, accounting for minting and boost.
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
