---
id: getMaxMintAmount
slug: /sdk/api/osToken/requests/getmaxmintamount
description: Use the StakeWise SDK getMaxMintAmount method to calculate the maximum number of osToken shares a user can mint.
---

#### Description:

Maximum number of **shares** for minting

#### Arguments:
| Name             | Type     | Required | Description                                                  |
|------------------|----------|----------|--------------------------------------------------------------|
| userAddress      | `string` | **Yes**  | The user address                                             |
| vaultAddress     | `string` | **Yes**  | The address of the vault                                     |
| additionalStakedAssets | `bigint` | **No**   | Extra staked assets to fold into the position before computing the max — e.g. a deposit being staked in the same transaction. See [sdk.vault.depositAndMint](/sdk/api/vault/transactions/depositandmint), whose `receiveShares` you size with this                                     |

#### Returns:

```ts
type Output = bigint
```
#### Example:

```ts
await sdk.osToken.getMaxMintAmount({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```

When staking and minting in the same transaction, pass the not-yet-confirmed deposit as `additionalStakedAssets` so the max accounts for it — this is how you size `receiveShares` for [sdk.vault.depositAndMint](/sdk/api/vault/transactions/depositandmint):

```ts
await sdk.osToken.getMaxMintAmount({
  userAddress: '0x...',
  vaultAddress: '0x...',
  additionalStakedAssets: parseEther('1'), // assets being staked in the same batch
})
```
