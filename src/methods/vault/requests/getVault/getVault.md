---
id: getVault
slug: /vault/requests/getvault
---

#### Description:

Returns the master data of the vault

#### Arguments:

| Name         | Type     | Required | Description               |
|--------------|----------|----------|---------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault  | 

#### Returns:

```ts
type Output = {
  apy: number
  baseApy: number
  version: number
  isErc20: boolean
  capacity: string
  createdAt: number
  feePercent: number
  isPrivate: boolean
  isGenesis: boolean
  vaultAdmin: string
  totalAssets: string
  performance: number
  feeRecipient: string
  vaultAddress: string
  mevRecipient: string
  queuedShares: string
  whitelistCount: number
  lastFeePercent: number
  blocklistCount: number
  imageUrl: string | null
  isSmoothingPool: boolean
  tokenName: string | null
  whitelistManager: string
  blocklistManager: string
  depositDataManager: string
  tokenSymbol: string | null
  displayName: string | null
  description: string | null
  lastFeeUpdateTimestamp: string
  osTokenConfig: {
    ltvPercent: string
    liqThresholdPercent: string
  }
}
```

| Name                        | Description                                     |
|-----------------------------|-------------------------------------------------|
| `version`                   | Vault version |
| `apy`                       | Current vault apy |
| `baseApy`                  | The vault average weekly base APY (without extra incentives) |
| `isErc20`                   | Does the vault have its own ERC20 token |
| `capacity`                  | Maximum TVL of Vault |
| `createdAt`                 | Date of Creation |
| `feePercent`                | Commission rate |
| `isPrivate`                 | Whether the vault is private |
| `isGenesis`                 | Is a stakewise vault |
| `queuedShares`              | The total number of queued shares |
| `isBlocklist`               | Whether the vault has blocklist |
| `vaultAdmin`                | Vault administrator address |
| `totalAssets`               | TVL of Vault |
| `feeRecipient`              | Vault fee address |
| `whitelistManager`          | Whitelist manager |
| `vaultAddress`              | Address of vault |
| `mevRecipient`              | Validator fee recipient |
| `whitelistCount`            | Number of addresses in the [whitelist](/vault/requests/getwhitelist) |
| `blocklistCount`            | Number of addresses in the [blocklist](/vault/requests/getblocklist) |
| `imageUrl`                  | Link for vault logo |
| `blocklistManager`          | Blocklist manager |
| `depositDataManager`        | Keys manager address |
| `isSmoothingPool`           | Smoothing poll or Vault escrow |
| `tokenName`                 | ERC20 token name |
| `tokenSymbol`               | ERC20 token symbol |
| `displayName`               | Name of vault |
| `allocatorMaxBoostApy`      | The average max boost APY earned in this vault by the allocator |
| `description`               | Description of vault |
| `whitelist`                 | List of authorized users for deposits |
| `blocklist`                 | List of blocked users for deposits |
| `performance`               | Vault performance indicator (percent) |
| `lastFeeUpdateTimestamp`               | The timestamp of the last fee update |
| `lastFeePercent`               | The vault last fee percent |
| `osTokenConfig`             | contains the ltvPercent, which is the percentage used to calculate how much a user can mint in OsToken shares, and thresholdPercent, which is the liquidation threshold percentage used to calculate the health factor for the OsToken position |

#### Example:

```ts
await sdk.vault.getVault({ vaultAddress: '0x...' })
```
