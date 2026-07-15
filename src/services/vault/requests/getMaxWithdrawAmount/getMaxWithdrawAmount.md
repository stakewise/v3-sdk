---
id: getMaxWithdrawAmount
slug: /sdk/api/vault/requests/getmaxwithdrawamount
description: Use the StakeWise SDK getMaxWithdrawAmount method to calculate the maximum amount a user can withdraw from a vault, optionally including the assets freed by burning their osToken.
---

#### Description:

How much a user can withdraw. The result accounts for the user's minted osToken; if there is no minted balance, it equals their staked assets. Pass `withBurn: true` to also include the assets that would be freed by burning the user's osToken, capped by the balance held in their wallet.

#### Arguments:

| Name         | Type      | Required | Info                                                              |
|--------------|-----------|----------|------------------------------------------------------------------|
| vaultAddress | `string`  | **Yes**  | The address of the vault                                         |
| userAddress  | `string`  | **Yes**  | The address of the user                                         |
| withBurn     | `boolean` | No       | Include assets freed by burning osToken (capped by the wallet)  |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
await sdk.vault.getMaxWithdrawAmount({
  vaultAddress: '0x...',
  userAddress: '0x...',
})
```
