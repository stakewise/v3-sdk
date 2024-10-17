# Updates
### 1. `sdk.vault.getVault`

#### New output field:

```ts
type AddedOutput = {
  osTokenConfig: {
    ltvPercent: string
    thresholdPercent: string
  }
  maxBoostApy: number
  isGenesis: boolean
}
```

| Name | Description |
|------|-------------|
| `osTokenConfig` | contains the `ltvPercent`, which is the percentage used to calculate how much a user can mint in OsToken shares, and `thresholdPercent`, which is the liquidation threshold percentage used to calculate the health factor for the OsToken position |
| `isGenesis` | This vault is owned by stakewise |
| `maxBoostApy` | The vault average max boost APY |

---
### 2. `sdk.vault.getHarvestParams`

#### New output format:

```ts
type Output = {
  canHarvest: boolean // NEW
  params: {
    reward: string
    proof: Array<string>
    rewardsRoot: string
    unlockedMevReward: string 
  }
}
```

---

### 3. Removed method
### `sdk.osToken.getAvgRewardsPerSecond`

---

### 4. Removed output field
### `sdk.osToken.getPosition`

Removed fee and added boost params (mainnet only)

```ts
type RemovedOutput = {
  minted: {
    fee: bigint
  }
}

type AddedOutput = {
  boost: {
    shares: bigint
    percent: number
  }
}
```

| Name | Description |
|------|-------------|
| `boost.shares` | Count of osToken tokens with boost |
| `percent.percent` | Proportion of tokens with and without boost, if 100 percent, then all tokens have a boost |

### 5. Added method getStakewiseStats
### `sdk.utils.getStakewiseStats`
#### Getting common stakewise data for the network

---

### 6. Added optional input field
### `sdk.vault.getExitQueuePositions`
#### Added Argument:

| Name         | Type      | Required |
|--------------|-----------|----------|
| isClaimed    | `boolean` | **No**   | 

---

### 7. Removed output field
### `sdk.vault.getStakeBalance`

```ts
type RemovedOutput = {
  shares: bigint
}
```
---

### 8. Deprecated method `sdk.osToken.getConfig`
### Use `sdk.vault.getVault` instead to get the result in `osTokenConfig` field.

---

### 9. Add methods
### `sdk.vault.getVaultStats` & `sdk.vault.getUserStats`
#### With the help of this data it is possible to build a chart.

---

### 10. Removed method `sdk.vault.getSnapshots`
### Use `sdk.vault.getVaultStats` instead 

---

### 11. Update method `sdk.vault.getUserRewards`
#### Update output format:

```ts
type Output = Array<{
  date: number
  dailyRewards: number
  dailyRewardsEur: number
  dailyRewardsGbp: number
  dailyRewardsUsd: number
}>
```

#### New arguments:

| Name | Type     | Type        | Description |
|------|----------|-------------|---|
| dateFrom | `number` | **Yes** | Time to start in milliseconds |
| dateTo | `number` | **Yes** | Time to end  in milliseconds              |
| userAddress  | `string` | **Yes**  | The user address              | 
| vaultAddress | `string` | **Yes**  | The address of the vault      | 

---

### 12. Added method getFiatRates
### `sdk.utils.getFiatRates`
#### Getting fiat values for the network

---

### 13. Removed input field
### `sdk.vault.operate`
#### Removed depositDataRoot use `vault.setDepositDataRoot` instead
#### Removed depositDataManager use `vault.setDepositDataManager` instead

```ts
type RemovedInput = {
  depositDataManager: string
  depositDataRoot: string
}
```

---

### 14. Removed method `sdk.vault.getScorePercentiles`

---
