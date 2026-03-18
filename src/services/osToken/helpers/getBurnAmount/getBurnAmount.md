---
id: getBurnAmount
title: getBurnAmount
slug: sdk/api/osToken/helpers/getburnamount
description: "StakeWise SDK getBurnAmount helper (deprecated): calculates how many osTokens to burn to fully withdraw your deposit."
---

# Deprecated!
Use getBurnAmountForUnstake

#### Description:

How many osToken burn do you need to make to withdraw all deposit.

#### Arguments:
| Name            | Type     | Required | Description                                                  |
|-----------------|----------|----------|--------------------------------------------------------------|
| vaultAddress    | `string` | **Yes**  | The address of the vault                                     |
| ltvPercent      | `bigint` | **Yes**  | [sdk.vault.getVault](/sdk/api/vault/requests/getvault)               |
| mintedAssets    | `bigint` | **Yes**  | [sdk.osToken.getPosition](/sdk/api/osToken/requests/getposition)     |
| stakedAssets    | `bigint` | **Yes**  | [sdk.vault.getStakeBalance](/sdk/api/vault/requests/getstakebalance) |
| newStakedAssets | `bigint` | **Yes**  | The future amount of stake after the deposit                 |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
sdk.osToken.getBurnAmount({
  ltvPercent: 0n,
  mintedAssets: 0n,
  stakedAssets: 0n,
  newStakedAssets: 0n,
  vaultAddress: '0x...',
})
```
