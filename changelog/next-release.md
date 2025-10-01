# New

- Upgraded Ethereum/Web3, GraphQL codegen, and TypeScript toolchain.
- Updated Rollup build system and plugins.
- Refreshed testing (Hardhat, OpenZeppelin, Jest) and linting (ESLint).
- Add new ESLint configuration and pre-push hook
- Refactor tests and improve error handling in access checks

### 1. Get distributor rewards and claim:
- [sdk.distributorRewards.getRewards](/distributorRewards/requests/getrewards)
- [sdk.distributorRewards.claim](/distributorRewards/transactions/claim)

### 2. Add new method [sdk.boost.upgradeLeverageStrategy](https://sdk.stakewise.io/boost/transactions/upgradeleveragestrategy)
Upgrade the leverage strategy contract

### 3. Add new method [sdk.boost.getLeverageStrategyData](https://sdk.stakewise.io/boost/requests/getleveragestrategydata)
Get the `leverageStrategyData` object with `version` and `isUpgradeRequired` properties.

# Updates
### 1. [sdk.boost.claimQueue](https://sdk.stakewise.io/boost/transactions/claimQueue)

#### Added new input field:

```ts
type Input = {
  leverageStrategyVersion?: 1 | 2
}
```

### 2. [sdk.boost.lock](https://sdk.stakewise.io/boost/transactions/lock)

#### Added new input field:

```ts
type Input = {
  leverageStrategyData?: {
    version: 1 | 2
    isUpgradeRequired: boolean
  }
}
```

### 3. [sdk.boost.unlock](https://sdk.stakewise.io/boost/transactions/unlock)

#### Added new input field:

```ts
type Input = {
  leverageStrategyData?: {
    version: 1 | 2
    isUpgradeRequired: boolean
  }
}
```

### 4. [sdk.boost.getQueuePosition](https://sdk.stakewise.io/boost/requests/getqueueposition)

#### Added new output field:

```ts
type Output = {
  version: number
}
```

### 5. [sdk.rewardSplitter.getClaimAmount](https://sdk.stakewise.io/rewardSplitter/requests/getclaimamount)

```ts
type Item = {
  assets: bigint
  address: string
}

type Output = {
  active: Item
  inactive: Array<Item>
}
```

| Name             | Description                                                      |
|------------------|------------------------------------------------------------------|
| `active`   | Rewards amount from active fee splitter |
| `inactive` | Aave borrow status. enum BorrowStatus (Healthy, Moderate, Risky) |


### 6. [sdk.rewardSplitter.setClaimer](https://sdk.stakewise.io/rewardSplitter/transactions/setclaimer)

#### Input
| Name                  | Type     | Required | Description |
|-----------------------|----------|----------|-----------------------------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| claimerAddress        | `string` | **Yes**  | The address of the claimer |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter |

### 7. [sdk.vault.operate](https://sdk.stakewise.io/vault/transactions/operate)

#### Add new input field:

```ts
type Input = {
  admin: string
  feePercent: number
}

```
| Name           | Description                                                  |
|----------------|--------------------------------------------------------------|
| `admin`        | Changing the vault administrator                             |
| `feePercent`   | Changing fee percent charged by the vault                    |


### 8. [sdk.vault.getRewardSplitters](https://sdk.stakewise.io/vault/requests/getrewardsplitters)

#### Add new output field:
```ts
type FeeRecipient = {
  shares: bigint
  percent: number
  address: string
}

type RewardSplitter = {
  owner: string
  address: string
  claimer: string // new field
  version: number
  totalShares: bigint
  feeRecipients: FeeRecipient[]
}

type Output = {
  rewardSplitters: RewardSplitter[]
}
```

### 9. [sdk.vault.getUserStats](https://sdk.stakewise.io/vault/requests/getuserstats)

#### Extended the type for rewards:
```ts
type Stat = {
  time: number
  value: number
}

type Rewards = Stat & {
  extraData?: {
    boostRewards: number
    stakeRewards: number
    extraRewards: number
  }
}

type Output = {
  apy: Stat[]
  balance: Stat[]
  rewards: Rewards[]
}
```

### 10. [sdk.vault.getStakeBalance](https://sdk.stakewise.io/vault/requests/getstakebalance)

#### Add new output field:
```ts
type Output = {
  assets: bigint
  totalEarnedAssets: bigint
  totalStakeEarnedAssets: bigint // new field
  totalBoostEarnedAssets: bigint // new field
  totalExtraEarnedAssets: bigint // new field
}
```

### 11. [sdk.vault.getVault](https://sdk.stakewise.io/vault/requests/getvault)

#### Add new output field:
```ts
type Output = {
  lastFeePercent: number // new field
  lastFeeUpdateTimestamp: string // new field
}
