---
id: getMaxWithdrawAmount
slug: /vault/requests/getmaxwithdrawamount
---

#### Description:

How much a user can withdraw. Use this method if the user has mintedAssets, if minted balance is null then maxWithdraw will be equal to stakedAssests.

#### Arguments:

| Name         | Type     | Required | Info                                                         |
|--------------|----------|----------|--------------------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault                                     |
| userAddress  | `string` | **Yes**  | The address of the user                                     |

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
