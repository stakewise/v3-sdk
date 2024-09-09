- Breaking change: Removed `sdk.osToken.getConfig`. Use `sdk.vault.getVault` instead to get osToken config data `{ osTokenConfig: { ltvPercent, thresholdPercent } }`.
- Added canHarvest: boolean to `sdk.vault.getHarvestParams` response.

# Updates
### 1. `sdk.vault.getVault`

#### New output field:

```ts
type AddedOutput = {
  osTokenConfig: {
    ltvPercent: string
    thresholdPercent: string
  }
}
```

| Name            | Description                                                                                                                                                                                                                                         |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `osTokenConfig` | contains the `ltvPercent`, which is the percentage used to calculate how much a user can mint in OsToken shares, and `thresholdPercent`, which is the liquidation threshold percentage used to calculate the health factor for the OsToken position |

---
### 2. `sdk.vault.getHarvestParams`

#### New output field:

```ts
type AddedOutput = {
  canHarvest: boolean
}
```

---

### 3. Removed method
### `sdk.vault.getVault`
