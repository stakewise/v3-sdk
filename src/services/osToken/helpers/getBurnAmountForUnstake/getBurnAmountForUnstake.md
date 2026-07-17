---
id: getBurnAmountForUnstake
slug: /sdk/api/osToken/helpers/getburnamountforunstake
description: Use the StakeWise SDK getBurnAmountForUnstake helper to calculate the osToken that must be burned to unstake, in full or up to a target amount.
---

#### Description:

Returns the amount of osToken that must be burned to unstake. Omit `assets` for a full exit (all underlying tokens); pass a target `assets` to burn only what that withdrawal needs — it returns `0n` when the amount is already within the max withdraw.

#### Arguments:
| Name         | Type     | Required | Description                                    |
|--------------|----------|----------|------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault                       |
| userAddress  | `string` | **Yes**  | The user address                               |
| assets       | `bigint` | **No**   | Target withdrawal amount, omit for a full exit |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
sdk.osToken.getBurnAmountForUnstake({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
