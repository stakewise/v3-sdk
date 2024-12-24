# Updates
### 1. `sdk.vault.getVault`

#### New output field:

```ts
type AddedOutput = {
  osTokenConfig: {
    ltvPercent: string
    liqThresholdPercent: string
  }
  queuedShares: string
  allocatorMaxBoostApy: number
  osTokenHolderMaxBoostApy: number
  isGenesis: boolean
}
```

| Name                       | Description                                                                                                                                                                                                                                            |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `osTokenConfig`            | contains the `ltvPercent`, which is the percentage used to calculate how much a user can mint in OsToken shares, and `liqThresholdPercent`, which is the liquidation threshold percentage used to calculate the health factor for the OsToken position |
| `isGenesis`                | This vault is owned by stakewise                                                                                                                                                                                                                       |
| `allocatorMaxBoostApy`     | The average max boost APY earned in this vault by the allocator                                                                                                                                                                                        |
| `osTokenHolderMaxBoostApy` | The average max boost APY earned in this vault by the osToken holder                                                                                                                                                                                   |
| `queuedShares`             | The total number of queued shares                                                                                                                                                                                                                      |

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

Removed fee

```ts
type RemovedOutput = {
  minted: {
    fee: bigint
  }
}
```

| Name           | Description                        |
|----------------|------------------------------------|
| `boost.shares` | Count of osToken tokens with boost |

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

### 9. Added methods
### `sdk.vault.getVaultStats` & `sdk.vault.getUserStats`
#### With the help of this data it is possible to build a chart.

---

### 10. Removed method `sdk.vault.getSnapshots`
### Use `sdk.vault.getVaultStats` instead 

---

### 11. Updated method `sdk.vault.getUserRewards`
#### Updated output format:

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

| Name         | Type     | Type    | Description                   |
|--------------|----------|---------|-------------------------------|
| dateFrom     | `number` | **Yes** | Time to start in milliseconds |
| dateTo       | `number` | **Yes** | Time to end  in milliseconds  |
| userAddress  | `string` | **Yes** | The user address              | 
| vaultAddress | `string` | **Yes** | The address of the vault      | 

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

### 15. Added method
### `sdk.boost.getData`
#### Get the address of the leverage strategy proxy contract
---

### 16. Added method
### `sdk.boost.getLeverageStrategyProxy`
#### Get the address of the leverage strategy proxy contract

---

### 17. Added method
### `sdk.utils.getPermitSignature`
#### Get permit signature for ERC20 token

---

### 18. Added method
### `sdk.boost.lock`
#### Boost your osToken apy using leverage staking

---

### 19. Added method
### `sdk.boost.unlock`
#### Unboost your boosted osToken

---

### 20. Added method
### `sdk.boost.claimQueue`
#### Claim user unboost queue

---

### 20. Changed output field
### `sdk.vault.getExitQueuePositions`

```ts
// Output changed type from bigint to string
positions[number]['exitQueueIndex']
```

---

### 21. Added method
### `sdk.utils.getFiatRatesByDay`
#### Get fiat data by day

---

### 22. `sdk.osToken.getAPY`

#### New output field:

```ts
type Output = {
  apy: string
  feePercent: number
}
```

---

### 23. Added input field `referrerAddress`
### `sdk.vault.deposit`
### `sdk.osToken.mint`

---

### 24. `sdk.utils.getFiatRates`

#### New output fields:

```ts
type AddedOutput = {
  'USD/CNY': number
  'USD/JPY': number
  'USD/KRW': number
  'USD/AUD': number
}
```

---

### 25. `sdk.vault.getUserRewards`

#### New output fields:

```ts
type AddedOutput = {
  dailyRewardsCny: number
  dailyRewardsJpy: number
  dailyRewardsKrw: number
  dailyRewardsAud: number
}
```

---

### 26. `sdk.utils.getFiatRatesByDay`

#### New output fields:

```ts
type AddedOutput = {
  usdToCnyRate: string
  usdToJpyRate: string
  usdToKrwRate: string
  usdToAudRate: string
}
```
