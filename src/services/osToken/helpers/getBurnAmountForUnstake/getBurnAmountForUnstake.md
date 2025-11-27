---
id: getBurnAmountForUnstake
slug: /osToken/helpers/getburnamountforunstake
---

#### Description:

This method returns the amount of osToken that must be burned to enable unstaking of all underlying tokens.

#### Arguments:
| Name            | Type     | Required | Description                                                  |
|-----------------|----------|----------|--------------------------------------------------------------|
| vaultAddress    | `string` | **Yes**  | The address of the vault                                     |
| userAddress     | `string` | **Yes**  | The user address                                             |

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
