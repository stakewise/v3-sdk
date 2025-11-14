---
id: getMaxMint
slug: /osToken/requests/getmaxmint
---

# Deprecated!
Use getMaxMintAmount

#### Description:

Maximum number of **shares** for minting

#### Arguments:
| Name         | Type     | Required | Description                                                  |
|--------------|----------|----------|--------------------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault                                     |
| ltvPercent   | `bigint` | **Yes**  | [sdk.vault.getVault](/vault/requests/getvault)               |
| stakedAssets | `bigint` | **Yes**  | [sdk.vault.getStakeBalance](/vault/requests/getstakebalance) |
| mintedAssets | `bigint` | **Yes**  | [sdk.osToken.getPosition](/osToken/requests/getposition)     |

#### Returns:

```ts
type Output = bigint
```
#### Example:

```ts
await sdk.osToken.getMaxMint({
  ltvPercent: 0n,
  mintedAssets: 0n,
  stakedAssets: 0n,
  vaultAddress: '0x...',
})
```
