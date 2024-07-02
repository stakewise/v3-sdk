<p align="center">
  <img src="https://app.stakewise.io/logo512.png" alt="StakeWise Logo" width="100">
</p>

# StakeWise Labs V3 SDK

The official SDK designed for effortless data retrieval from the StakeWise platform. This SDK provides a streamlined interface over GraphQL requests and contract interactions.

![Version](https://img.shields.io/npm/v/@stakewise/v3-sdk)
![Ethers version](https://img.shields.io/badge/ethers-6.11.1-purple)
![Size](https://img.shields.io/bundlephobia/min/@stakewise/v3-sdk?label=Size)
![Unit Tests](https://github.com/stakewise/v3-sdk/actions/workflows/unit-tests.yml/badge.svg)
![GitHub issues](https://img.shields.io/github/issues-raw/stakewise/v3-sdk)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/stakewise/v3-sdk)
![GitHub forks](https://img.shields.io/github/forks/stakewise/v3-sdk)

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [API - Vault](#api-vault)
- [API - osToken](#api-ostoken)
- [API - Utils](#api-utils)
- [API - Transactions](#transactions)

## Prerequisites

For successful utilization of this library, ensure you have `ethers` version 6.12.1 or higher installed. The `ethers` package isn't bundled within the SDK. Instead, we leverage `peerDependencies` to maintain a lean package size.

**Note**: If your project uses version 5 of `ethers`, consider installing version 6 alongside it. Adjust import paths via a bundler. Additionally, you might consider loading our SDK asynchronously using dynamic imports to optimize your application's initial load performance. Here's a sample configuration with webpack:

`npm i ethers-6@npm:ethers@6.12.1`

```typescript
webpackConfig.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /ethers$/m, (resource) => {
      const isStakeWise = /@stakewise\/v3-sdk/.test(resource.context)

      if (isStakeWise) {
        resource.request = resource.request.replace(/ethers/, 'ethers-6')
      }
    }
  )
)
```
You can do something similar for other builders as well

## Installation and Setup
```bash
npm i @stakewise/v3-sdk
```

If your builder doesn't support `.graphql` files, then you need to add a plugin. For example, for webpack this would be graphql-tag.
If you are using another builder, you can easily find GQL support plugins

```ts
webpackConfig.module.rules.push(
  {
    test: /\.(graphql|gql)$/,
    loader: 'graphql-tag/loader',
    exclude: /node_modules/,
  }
)
```

Create SDK instance

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({ network: Network.Mainnet })

```
#### SDK Constructor Arguments:

| Name               | Type                                 | Required | Description |
|--------------------|--------------------------------------|----------|----------------|
| network            | `Network`                            | **Yes**  | Chain id |
| provider           | `BrowserProvider or JsonRpcProvider` | **No**   | You can provide your implementation of the provender for ethers |
| endpoints.web3     | `string OR string[]`                 | **No**   | Your urls for connect to blockchain |
| endpoints.subgraph | `string`                             | **No**   | stakewise sbugraph url |
| endpoints.api      | `string`                             | **No**   | stakewise backend url |

## Quick Links

##### Request table:
| **Vault**                                                     | **osToken**                                                   | **RewardSplitter**                                                |
|---------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------|
| [vault.getStakerActions](#sdkvaultgetstakeractions)           | [osToken.getBurnAmount](#sdkostokengetburnamount)             | [rewardSplitter.getClaimAmount](#sdkrewardsplittergetclaimamount) |
| [vault.getSnapshots](#sdkvaultgetsnapshots)                   | [osToken.getHealthFactor](#sdkostokengethealthfactor)         |                                                                   |
| [vault.getExitQueuePositions](#sdkvaultgetexitqueuepositions) | [osToken.getAPY](#sdkostokengetapy)                           |                                                                   |
| [vault.getValidators](#sdkvaultgetvalidators)                 | [osToken.getPosition](#sdkostokengetposition)                 |                                                                   |
| [vault.getVault](#sdkvaultgetvault)                           | [osToken.getMaxMint](#sdkostokengetmaxmint)                   |                                                                   |
| [vault.getMaxWithdraw](#sdkvaultgetmaxwithdraw)               | [osToken.getSharesFromAssets](#sdkostokengetsharesfromassets) |                                                                   |
| [vault.getHarvestParams](#sdkvaultgetharvestparams)           | [osToken.getAssetsFromShares](#sdkostokengetassetsfromshares) |                                                                   |
| [vault.getStakeBalance](#sdkvaultgetstakebalance)             | [osToken.getRate](#sdkostokengetrate)                         |                                                                   |
| [vault.getScorePercentiles](#sdkvaultgetscorepercentiles)     | [osToken.getConfig](#sdkostokengetconfig)                     |                                                                   |
| [vault.getUserRewards](#sdkvaultgetuserrewards)               |                                                               |                                                                   |
| [vault.getWhitelist](#sdkvaultgetwhitelist)                   |                                                               |                                                                   |
| [vault.getBlocklist](#sdkvaultgetblocklist)                   |                                                               |                                                                   |
| [vault.getRewardSplitters](#sdkvaultgetrewardsplitters)       |                                                               |                                                                   |

| **Utils**                                           |
|-----------------------------------------------------|
| [utils.getSwiseUsdPrice](#sdkutilsgetswiseusdprice) |
| [utils.getTransactions](#sdkutilsgettransactions)   |


All of these methods (except synchronous getHealthFactor) return a promise that can be
aborted by invoking the `abort()` function.

If `abort()` is invoked, the in-progress promise will not be resolved or rejected, and the
network request will be canceled.
If the promise has already been resolved or rejected, invoking `abort()` will not have any effect.

Using `abort()` can be beneficial when querying lists such as `whitelist` or `blocklist`. If we
are retrieving the list based on a filter string from user input, even with debounced requests,
the user might continue typing and modify the filter after the initial request is sent. In such
cases, a second request may be initiated. To prevent fetching data from the first request, we
can call `abort()`.

```ts
const promise = sdk.vault.getWhitelist({
  vaultAddress: '0x...',
})

promise.abort()
```

##### Table of transactions:
| **Vault**                                                         | **RewardSplitter**                                                              | **osToken**                         |
|-------------------------------------------------------------------|---------------------------------------------------------------------------------|-------------------------------------|
| [sdk.vault.deposit](#sdkvaultdeposit)                             | [sdk.rewardSplitter.create](#sdkrewardsplittercreate)                           | [sdk.osToken.mint](#sdkostokenmint) |
| [sdk.vault.withdraw](#sdkvaultwithdraw)                           | [sdk.rewardSplitter.claimRewards](#sdkrewardsplitterclaimrewards)               | [sdk.osToken.burn](#sdkostokenburn) | 
| [sdk.vault.operate](#sdkvaultoperate)                             | [sdk.rewardSplitter.updateFeeRecipients](#sdkrewardsplitterupdatefeerecipients) |                                     |
| [sdk.vault.setDepositDataManager](#sdkvaultsetdepositdatamanager) |                                                                                 |                                     |
| [sdk.vault.setDepositDataRoot](#sdkvaultsetdepositdataroot)       |                                                                                 |                                     |
| [sdk.claimExitQueue](#sdkvaultclaimexitqueue)                     |                                                                                 |                                     |


## API-Vault

### `sdk.vault.getStakerActions`

#### Description:

Get a list of interactions with the vault.

#### Arguments:

| Name | Type | Required | Description |
|------|------|-------------|---------|
| vaultAddress | `string` | **Yes** | - |
| userAddress | `string` | **No** | If a user address is specified, the query will look for events for that address and the vault address only |
| types | `AllocatorActionType` | **Yes** | Event types can be found in `enum AllocatorActionType` which you can import from the library |
| limit | `number` | **Yes** | To implement pagination |
| skip | `number` | **Yes** | To implement pagination |

#### Returns:

```ts
type Output = Array<{
  actionType: AllocatorActionType
  createdAt: number
  assets: string
  shares: string
  link: string
  id: string
}>
```

In events related to osToken you can use shares, in all other assets

| Name | Description |
|------|-------------|
| `id` | Event identifier |
| `assets` | Transaction amount |
| `shares` | Transaction amount |
| `createdAt` | Transaction date |
| `actionType` | Type of action |
| `link` | Transaction link (etherscan/blockscout) |

#### Example:

```ts
import { AllocatorActionType } from '@stakewise/v3-sdk'

await sdk.vault.getStakerActions({
  skip: 0,
  limit: 20,
  userAddress: '0x...',
  vaultAddress: '0x...',
  types: [
    AllocatorActionType.Redeemed,
    AllocatorActionType.Deposited,
    AllocatorActionType.VaultCreated,
    AllocatorActionType.ExitedAssetsClaimed,
  ],
})
```
---
### `sdk.vault.getSnapshots`

#### Description:

TVL and APY snapshots for the vault. With the help of this data it is possible to build a chart.

#### Arguments:

| Name         | Type     | Type            | Description |
|--------------|----------|-----------------|---------|
| vaultAddress | `string` | **Yes**     | - |
| dateFrom     | `number` | **Yes**     | Time to start |

#### Returns:

```ts
type Snapshot = {
  APY: number
  TVL: string
}

type Output = {
  days: Record<number, Snapshot>
  first: Snapshot
}
```

| Name | Description |
|------|-------------|
| `days` | The result of the query on your parameters, is returned as an object where the keys are timestamps |
| `first` | We always send the very first saved snapshot regardless of the request parameters, this helps for rendering the chart |

#### Example:

```ts
await sdk.vault.getSnapshots({
  vaultAddress: '0x...',
  dateFrom: 1695730032793,
})
```
---
### `sdk.vault.getScorePercentiles`

#### Description:

This method is used to fetch information indicating the effectiveness or performance level of the vault. 
The retrieved data includes percentiles corresponding to various statuses.

#### Returns:

```ts
type Output = {
  percentile25: number
  percentile50: number
  percentile75: number
}
```

| Name | Description                                                                                             |
|------|---------------------------------------------------------------------------------------------------------|
| `percentile25` | Represents the value corresponding to the **lowest** status. It is associated with the color (red)      |
| `percentile50` | Represents the value corresponding to the **moderate** status. It is associated with the color (orange) |
| `percentile75` | Represents the value corresponding to the **good** status. It is associated with the color (light green)      |

_For values greater than percentile75 the status corresponds to **excellent** with color (green)_

#### Example:

```ts
await sdk.vault.getScorePercentiles()
```
---
### `sdk.vault.getUserRewards`

#### Description:

Daily rewards for the user who has made a deposit in the vault. With the help of this data it is possible to build a chart.

#### Arguments:

| Name | Type     | Type        | Description |
|------|----------|-------------|---|
| vaultAddress | `string` | **Yes** | - |
| userAddress | `string` | **Yes** | - |
| dateFrom | `number` | **Yes** | Time to start |
| dateTo | `number` | **No** | Time to end |
| fillGaps | `boolean` | **No** | Fill in the empty days with zeros |

#### Returns:

```ts
type UserReward = {
  date: number
  sumRewards: string
  dailyRewards: string
  dailyRewardsEur: string
  dailyRewardsGbp: string
  dailyRewardsUsd: string
}

type Output = {
  days: Record<number, UserReward>
}
```

| Name | Description |
|------|-------------|
| `days` | The result of the query on your parameters, is returned as an object where the keys are timestamps |

#### Example:

```ts
await sdk.vault.getUserRewards({
  userAddress: '0x...',
  vaultAddress: '0x...',
  dateFrom: 1695730032793,
})
```
---
### `sdk.vault.getWhitelist`

#### Description:

Fetch the whitelist for private vaults. Only addresses included in this list are eligible to stake in the private vault. The number of addresses in this list is indicated by the vault whitelistCount field.


#### Arguments:

| Name | Type              | Type        | Description                                                                                                                                  |
|------|-------------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| vaultAddress | `string`          | **Yes** | -                                                                                                                                   |
| addressIn | `string[]`   | **No** | Filters results to include only addresses in the provided list. Helps to check, for example, if several addresses are added to the whitelist |
| orderDirection | `'asc' \| 'desc'` | **No** | Specifies the sorting order. Defaults to `desc` (descending order)                                                                 |
| search | `string`        | **No** | Filters results by the address field                                                                                                         |
| limit | `number`         | **No** | Limits the number of addresses returned. Defaults to 100                                                                                     |
| skip | `number`          | **No** | Skips the specified number of addresses. Defaults to 0                                                                                       |

#### Returns:

```ts
type List = {
  createdAt: number
  address: string
}

type Output = {
  whitelist: List[]
}
```

| Name | Description |
|------|-------------|
| `whitelist` | An array of objects representing the result of the query based on your parameters |

#### Example:

```ts
await sdk.vault.getWhitelist({
  vaultAddress: '0x...',
})
```
---
### `sdk.vault.getBlocklist`

#### Description:

Fetch the blocklist for blocklisted vaults. Addresses included in this list are not eligible to stake in the blocklisted vault. The number of addresses in this list is indicated by the vault blocklistCount field.


#### Arguments:

| Name | Type              | Type        | Description                                                                                                                                |
|------|-------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| vaultAddress | `string`  | **Yes** | -                                                                                                                                          |
| addressIn | `string[]`   | **No** | Filters results to include only addresses in the provided list. Helps to check, for example, if all OFAC addresses are added to the blocklist |
| orderDirection | `'asc' \| 'desc'` | **No** | Specifies the sorting order. Defaults to `desc` (descending order)                                                                                               |
| search | `string`        | **No** | Filters results by the address field                                                                                                       |
| limit | `number`         | **No** | Limits the number of addresses returned. Defaults to 100                                                                                              |
| skip | `number`          | **No** | Skips the specified number of addresses. Defaults to 0                                                                                                 |

#### Returns:

```ts
type List = {
  createdAt: number
  address: string
}

type Output = {
  blocklist: List[]
}
```

| Name | Description |
|------|-------------|
| `blocklist` | An array of objects representing the result of the query based on your parameters |

#### Example:

```ts
await sdk.vault.getBlocklist({
  vaultAddress: '0x...',
})
```
---
### `sdk.vault.getRewardSplitters`

#### Description:

Fetch the list of created reward splitters. A reward splitter is a contract designed to distribute vault rewards among multiple fee recipients in predefined proportions.
To use a reward splitter, its address should be added to the vault as a fee recipient.


#### Arguments:

| Name | Type     | Type    | Description                                                                                                                                |
|------|----------|---------|--------------------------------------------------------------------------------------------------------------------------------------------|
| vaultAddress | `string` | **Yes** | The address of the vault                                                                                                                                          |
| owner | `string` | **Yes** | The owner of the reward splitter |
| rewardSplitterAddress | `string` | **No**  | The address of the reward splitter (optional)                                                                                                 |

#### Returns:

```ts
type FeeRecipient = {
  shares: bigint
  percent: number
  address: string
}

type RewardSplitter = {
  owner: string
  address: string
  totalShares: bigint
  feeRecipients: FeeRecipient[]
}

type Output = {
  rewardSplitters: RewardSplitter[]
}
```

| Name              | Description |
|-------------------|-------------|
| `rewardSplitters` | An array of objects representing the result of the query based on your parameters |

#### Example:

```ts
await sdk.vault.getRewardSplitters({
  owner: '0x...',
  vaultAddress: '0x...',
})
```
---
### `sdk.vault.getExitQueuePositions`

#### Description:

Returns the withdrawal queue for a specific user.

#### Arguments:

| Name | Type | Required |
|------|------|----------|
| userAddress | `string` | **Yes**  |
| vaultAddress | `string` | **Yes**  | 

#### Returns:

```ts
type Position = {
  exitQueueIndex: bigint
  positionTicket: string
  timestamp: string
}

type Output = {
  total: bigint
  withdrawable: bigint
  positions: Position[]
}
```

| Name | Description |
|------|-------------|
| `positions` | Queue positions |
| `total` | Total withdrawal amount (in ETH) |
| `withdrawable` | Amount available for withdrawal (in ETH) |

#### Example:

```ts
await sdk.vault.getExitQueuePositions({
  vaultAddress: '0x...',
  userAddress: '0x...',
})
```
---
### `sdk.vault.getValidators`

#### Description:

Returns the running vault validators.

#### Arguments:

| Name | Type | Required | Description                                               |
|------|------|----------|-----------------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault                                  |
| limit | `number` | **No**   | Limits the number of validators returned. Defaults to 100 |
| skip | `number` | **No**   | Skips the specified number of validators. Defaults to 0   |

#### Returns:

```ts
type Output = {
  createdAt: number
  publicKey: string
  earned: string
  link: string
  apy: string
}
```

| Name | Description |
|------|-------------|
| `createdAt` | Date of Creation |
| `publicKey` | Validator public key |
| `earned` | Validator balance (in ETH) |
| `link` | Link to beaconchain |
| `apy` | Current validator apy |

#### Example:

```ts
await sdk.vault.getValidators({
  skip: 0,
  limit: 5,
  vaultAddress: '0x...'
})
```
---
### `sdk.vault.getEigenPods`

#### Description:

Returns eigen pods for restake vault.

#### Arguments:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| vaultAddress | `string` | **Yes**  | The address of the vault |
| limit | `number` | **No**   | Limits the number of eigen pods returned. Defaults to 100 |
| skip | `number` | **No**   | Skips the specified number of eigen pods. Defaults to 0 |

#### Returns:

```ts
type Output = {
  link: string
  owner: string
  operator: string
  restaked: string
  createdAt: number
  podAddress: string
}
```

| Name        | Description                     |
|-------------|---------------------------------|
| `createdAt` | Date of Creation                |
| `link` | Link to beaconchain             |
| `operator`  | The eigenPod's operator         |
| `podAddress`   | The eigenPod's address          |
| `restaked` | EgenPod's restaked (in ETH)      |
| `owner`        | The address of the eigen pod owner |

#### Example:

```ts
await sdk.vault.getEigenPods({
  skip: 0,
  limit: 5,
  vaultAddress: '0x...'
})
```
---
### `sdk.vault.getVault`

#### Description:

Returns the master data of the vault

#### Arguments:

| Name | Type | Required |
|------|------|-------------|
| vaultAddress | `string` | **Yes** | 

#### Returns:

```ts
type Output = {
  apy: number
  version: number
  isErc20: boolean
  capacity: string
  createdAt: number
  feePercent: number
  isPrivate: boolean
  isRestake: boolean
  vaultAdmin: string
  totalAssets: string
  performance: number
  feeRecipient: string
  vaultAddress: string
  mevRecipient: string
  whitelistCount: number
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
  restakeOperatorsManager: string
  restakeWithdrawalsManager: string
}
```

| Name               | Description                                                   |
|--------------------|---------------------------------------------------------------|
| `apy`              | Current vault apy                                             |
| `isErc20`          | Does the vault have its own ERC20 token                       |
| `capacity`         | Maximum TVL of Vault                                          |
| `createdAt`        | Date of Creation                                              |
| `feePercent`       | Commission rate                                               |
| `isPrivate`        | Whether the storage is private                                |
| `isRestake`        | Indicates whether the Vault is a restaking vault                                |
| `isBlocklist`      | Whether the storage has blocklist                             |
| `vaultAdmin`       | Vault administrator address                                   |
| `totalAssets`      | TVL of Vault                                                  |
| `feeRecipient`     | Vault fee address                                             |
| `whitelistManager` | Whitelist manager                                             |
| `vaultAddress`     | Address of vault                                              |
| `mevRecipient`     | Validator fee recipient                                       |
| `whitelistCount`   | Number of addresses in the [whitelist](#sdkvaultgetwhitelist) |
| `blocklistCount`   | Number of addresses in the [blocklist](#sdkvaultgetblocklist) |
| `imageUrl`         | Link for vault logo                                           |
| `blocklistManager` | Blocklist manager                                             |
| `depositDataManager` | Keys manager address                                        |
| `isSmoothingPool`  | Smoothing poll or Vault escrow                                |
| `tokenName`        | ERC20 token name                                              |
| `tokenSymbol`      | ERC20 token symbol                                            |
| `displayName`      | Name of vault                                                 |
| `description`      | Description of vault                                          |
| `whitelist`        | List of authorized users for deposits                         |
| `blocklist`        | List of blocked users for deposits                            |
| `performance`      | Vault performance indicator (percent)                         |
| `version`          | Vault version                                                 |
| `restakeOperatorsManager`          | If the Vault is a restaking vault, restake operators manager can add/remove restake operators                                                 |
| `restakeWithdrawalsManager`          | If the Vault is a restaking vault, restake withdrawals manager can manage EigenLayer withdrawals                                                 |

#### Example:

```ts
await sdk.vault.getVault({ vaultAddress: '0x...' })
```
---
### `sdk.vault.getMaxWithdraw`

#### Description:

How much a user can withdraw. Use this method if the user has mintedAssets, if minted balance is null then maxWithdraw will be equal to stakedAssests.

#### Arguments:

| Name | Type | Required | Info |
|------|------|-------------|-------|
| vaultAddress | `bigint` | **Yes** | Address of vault |
| ltvPercent | `bigint` | **Yes** | [sdk.osToken.getConfig](#sdkostokengetconfig) |
| mintedAssets | `bigint` | **Yes** | [sdk.osToken.getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Yes** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
await sdk.vault.getMaxWithdraw({
  ltvPercent: 0n,
  mintedAssets: 0n,
  stakedAssets: 0n,
  vaultAddress: '0x...',
})
```
---
### `sdk.vault.getHarvestParams`

#### Description:

Necessary to update the vault state

#### Returns:

```ts
type Output = {
  reward: string
  proof: Array<string>
  rewardsRoot: string
  unlockedMevReward: string 
}
```

#### Example:

```ts
await sdk.vault.getHarvestParams({ vaultAddress: '0x...' })
```
---
### `sdk.vault.getStakeBalance`

#### Description:

Getting user's balance in the vault

#### Arguments:

| Name | Type | Required |
|------|------|-------------|
| userAddress | `string` | **Yes** |
| vaultAddress | `string` | **Yes** |

#### Returns:

```ts
type Output = {
  shares: bigint
  assets: bigint
}
```

| Name | Description |
|------|-------------|
| `shares` | Balance in vault tokens  |
| `assets` | Balance in ETH |

#### Example:

```ts
await sdk.vault.getStakeBalance({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
---
## API-osToken

### `sdk.osToken.getBurnAmount`

#### Description:

How many osToken burn do you need to make to withdraw all deposit.

#### Arguments:
| Name | Type | Required | Description |
|------|------|-------------|---------|
| vaultAddress | `string` | **Yes** | Address of vault |
| ltvPercent | `bigint` | **Yes** | [sdk.osToken.getConfig](#sdkostokengetconfig) |
| mintedAssets | `bigint` | **Yes** | [sdk.osToken.getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Yes** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |
| newStakedAssets | `bigint` | **Yes** | The future amount of stake after the deposit |

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
---
### `sdk.osToken.getHealthFactor`

#### Description:

Get the health of the position

#### Arguments:
| Name | Type | Required | Description |
|------|------|-------------|---------|
| thresholdPercent | `bigint` | **Yes** | [sdk.osToken.getConfig](#sdkostokengetconfig) |
| mintedAssets | `bigint` | **Yes** | [sdk.osToken.getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Yes** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |

#### Returns:

```ts
type Output = {
  value: number
  health: OsTokenPositionHealth
}
```

| Name | Description |
|------|-------------|
| `value` | Numerical value |
| `health` | Position Health (enum) |

#### Example:

```ts
sdk.osToken.getHealthFactor({
  thresholdPercent: 0n,
  mintedAssets: 0n,
  stakedAssets: 0n,
})
```
---
### `sdk.osToken.getAPY`

#### Description:

Current os token APY

#### Returns:

```ts
type Output = string
```

#### Example:

```ts
const apy = await sdk.osToken.getAPY()
```
---
### `sdk.osToken.getAvgRewardsPerSecond`

#### Description:

osETH average rewards per second

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
const averageRewardsPerSecond = await sdk.osToken.getAvgRewardsPerSecond()
```
---
### `sdk.osToken.getPosition`

#### Description:

User position data

#### Arguments:
| Name | Type | Required | Description |
|------|------|-------------|---------|
| thresholdPercent | `bigint` | **Yes** | [sdk.osToken.getConfig](#sdkostokengetconfig) |
| stakedAssets | `bigint` | **Yes** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |
| userAddress | `string` | **Yes** | - |
| vaultAddress | `string` | **Yes** | - |

#### Returns:

```ts
type Output = {
  minted: {
    fee: bigint
    assets: bigint
    shares: bigint
  }
  healthFactor: {
    value: number
    health: OsTokenPositionHealth
  }
  protocolFeePercent: bigint
}
```

| Name | Description |
|------|-------------|
| `minted.fee` | Usage fee amount |
| `minted.shares` | Balance |
| `minted.assets` | Balance in ETH |
| `healthFactor` | [sdk.osToken.getHealthFactor](#sdkostokengethealthfactor)  |
| `protocolFeePercent` | Usage fee percent |

#### Example:

```ts
await sdk.osToken.getPosition({
  stakedAssets: 0n,
  userAddress: '0x...',
  vaultAddress: '0x...',
  thresholdPercent:  0n,
})
```
---
### `sdk.osToken.getMaxMint`

#### Description:

Maximum number of **shares** for minting

#### Arguments:
| Name | Type | Required | Description |
|------|------|-------------|---------|
| vaultAddress | `string` | **Yes** | Address of vault |
| ltvPercent   | `bigint` | **Yes** | [sdk.osToken.getConfig](#sdkostokengetconfig) |
| stakedAssets | `bigint` | **Yes** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |
| mintedAssets | `bigint` | **Yes** | [sdk.osToken.getPosition](#sdkostokengetposition) |

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
---
### `sdk.osToken.getAssetsFromShares`

#### Description:

Convert osToken to ETH

#### Arguments:

| Name | Type | Required |
|------|------|-------------|
| amount | `bigint` | **Yes** |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
await sdk.utils.getAssetsFromShares({ amount: 0n })
```
---
### `sdk.osToken.getSharesFromAssets`

#### Description:

Convert ETH to osToken

#### Arguments:

| Name | Type | Required |
|------|------|-------------|
| amount | `bigint` | **Yes** |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
await sdk.utils.getSharesFromAssets({ amount: 0n })
```
---
### `sdk.osToken.getRate`

#### Description:

Returns ETH - osToken rate

#### Returns:

```ts
type Output = string
```

#### Example:

```ts
await sdk.utils.getRate()
```
---
### `sdk.osToken.getConfig`

#### Description:

Basic information on the token

#### Arguments:

| Name         | Type     | Required | Description   |
|--------------|----------|----------|---------------|
| vaultAddress | `string` | **Yes**  | Vault address |

#### Returns:

```ts
type Output = {
  ltvPercent: bigint
  thresholdPercent: bigint
}
```
| Name | Description |
|------|-------------|
| `ltvPercent` | The percent used to calculate how much user can mint OsToken shares |
| `thresholdPercent` | The liquidation threshold percent used to calculate health factor for OsToken position |

#### Example:

```ts
await sdk.osToken.getConfig({ vaultAddress: '0x...' })
```
---
## RewardSplitter

### `sdk.rewardSplitter.getClaimAmount`

#### Description:

Calculates the amount of assets that the user can claim from the reward splitter.

#### Arguments:
| Name                  | Type     | Required | Description                                |
|-----------------------|----------|----------|--------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user making the request |
| vaultAddress          | `string` | **Yes**  | The address of the vault                   |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter         |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
const claimAmount = await sdk.rewardSplitter.getClaimAmount({
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
})
```
---
## API-utils

### `sdk.utils.getSwiseUsdPrice`

#### Description:

Current price of SWISE token to USD.

#### Returns:

```ts
type Output = string
```

#### Example:

```ts
await sdk.utils.getSwiseUsdPrice()
```
---
### `sdk.utils.getTransactions`

#### Description:

Retrieving a transaction to verify that the data went into the subgraph after the transaction

#### Arguments:

| Name | Type     | Required | Description      |
|------|----------|----------|------------------|
| hash | `string` | **Yes**  | Transaction hash |

#### Returns:

```ts
type Output = Array<{
  id: string
}>
```

#### Example:

```ts
await sdk.utils.getTransactions({ hash: '0x...' })
```
---
## Transactions

Transactions work through the provider you sent when creating an instance of our SDK class. Or, if you are a custodian, you can get the transaction data and sign it yourself. Each transaction also gives you the opportunity to get an approximate gas for sending it. For custodians, it is more reliable to calculate the gas yourself. Each transaction has encode and estimateGas methods for your convenience

### `sdk.vault.deposit`

#### Description:

Deposit (stake) in a vault

#### Arguments:

| Name         | Type     | Required | Description    |
|--------------|----------|----------|----------------|
| assets       | `bigint` | **Yes**  | Deposit amount |
| userAddress  | `string` | **Yes**  | -              |
| vaultAddress | `string` | **Yes**  | -              |

#### Example:

```ts
const params = {
  assets: 0n,
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.deposit(params)
// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.vault.deposit.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.deposit.estimateGas(params)
```
---
### `sdk.vault.withdraw`

#### Description:

Withdrawal of funds from a vault

#### Arguments:

| Name         | Type     | Required | Description     |
|--------------|----------|----------|-----------------|
| assets       | `bigint` | **Yes**  | Withdraw amount |
| userAddress  | `string` | **Yes**  | -               |
| vaultAddress | `string` | **Yes**  | -               |

#### Example:

```ts
const amountAssets = 200n // from input mb

const [
  { ltvPercent, thresholdPercent },
  stake,
] = await Promise.all([
  sdk.osToken.getConfig(),
  sdk.vault.getStakeBalance({
    vaultAddress: '0x...',
    userAddress: '0x...',
  }),
])

const osToken = await sdk.osToken.getPosition({
  stakedAssets: stake.assets,
  vaultAddress: '0x...',
  userAddress: '0x...',
  thresholdPercent,
})

const maxWithdrawAssets = await sdk.vault.getMaxWithdraw({
  mintedAssets: osToken.minted.assets,
  stakedAssets: stake.assets,
  vaultAddress: '0x...',
  ltvPercent,
})

if (amountAssets > maxWithdrawAssets) {
  // There is a withdrawal restriction if you have an osToken.

  return
}

const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: amountAssets,
}

// Send transaction
const hash = await sdk.vault.withdraw(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.withdraw.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.withdraw.estimateGas(params)
```
---
### `sdk.vault.claimExitQueue`

#### Description:

Take the freed tokens from the queue

#### Arguments:

| Name         | Type     | Required | Description                                                                       |
|--------------|----------|----------|-----------------------------------------------------------------------------------|
| positions    | `string` | **Yes**  | `postions` from [sdk.vault.getExitQueuePositions](#sdkvaultgetexitqueuepositions) |
| userAddress  | `string` | **Yes**  | -                                                                                 |
| vaultAddress | `string` | **Yes**  | -                                                                                 |

#### Example:

```ts
const exitQueue = await sdk.vault.getExitQueuePositions({
  vaultAddress: '0x...',
  userAddress: '0x...',
})

if (!exitQueue.withdrawable) {
  // The exit queue has not yet accumulated funds for withdrawal
  return
}

if (!exitQueue.data.length) {
  // No withdrawal positions
  return
}

const params = {
  positions: exitQueue.data,
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.claimExitQueue(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.claimExitQueue.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.claimExitQueue.estimateGas(params)
```
---
### `sdk.vault.setDepositDataRoot`

#### Description:

Adding root validators to vaults **version 2** or higher

#### Arguments:

| Name           | Type     | Required | Description |
|----------------|----------|----------|-------------|
| validatorsRoot | `string` | **Yes**  | The vault validators merkle tree  |
| userAddress    | `string` | **Yes**  | - |
| vaultAddress   | `string` | **Yes**  | - |

#### Example:

```ts
const params = {
  validatorsRoot: 'hash',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.setDepositDataRoot(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.setDepositDataRoot.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.setDepositDataRoot.estimateGas(params)
```
---
### `sdk.vault.setDepositDataManager`

#### Description:

Adding deposit data manager to vaults **version 2** or higher

#### Arguments:

| Name           | Type     | Required | Description |
|----------------|----------|----------|-------------|
| managerAddress | `string` | **Yes**  | New deposit-data manager  |
| userAddress    | `string` | **Yes**  | - |
| vaultAddress   | `string` | **Yes**  | - |

#### Example:

```ts
const params = {
  managerAddress: '0x...',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.setDepositDataManager(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.setDepositDataManager.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.setDepositDataManager.estimateGas(params)
```
---
### `sdk.vault.createEigenPod`

#### Description:

Adding eigen pod to the vault. Only for restake vaults and only restake operators manager can perform this action.

#### Arguments:

| Name           | Type     | Required | Description |
|----------------|----------|----------|-----------|
| userAddress    | `string` | **Yes**  | The address of the user making the request |
| vaultAddress   | `string` | **Yes**  | The address of the vault |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.createEigenPod(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.createEigenPod.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.createEigenPod.estimateGas(params)
```
---
### `sdk.vault.setEigenPodOperator`

#### Description:

Adding operator to the current eigen pod. This action is specific to restake vaults and can only be executed by the restake operators manager.

#### Arguments:

| Name           | Type     | Required | Description                      |
|----------------|----------|----------|----------------------------------|
| userAddress    | `string` | **Yes**  | The address of the user making the request |
| vaultAddress   | `string` | **Yes**  | The address of the vault |
| ownerAddress    | `string` | **Yes**  | The address of the eigen pod owner |
| operatorAddress    | `string` | **Yes**  | New operator for current eigen pods |

#### Example:

```ts
const params = {
  operatorAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.setEigenPodOperator(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.setEigenPodOperator.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.setEigenPodOperator.estimateGas(params)
```
---
### `sdk.vault.updateEigenPodOperator`

#### Description:

Update operator to the current eigen pod. This action is specific to restake vaults and can only be executed by the restake operators manager.

#### Arguments:

| Name           | Type     | Required | Description                      |
|----------------|----------|----------|----------------------------------|
| userAddress    | `string` | **Yes**  | The address of the user making the request                                 |
| vaultAddress   | `string` | **Yes**  | The address of the vault                                 |
| ownerAddress    | `string` | **Yes**  | The address of the eigen pod owner |
| operatorAddress    | `string` | **Yes**  | New operator for current eigen pods |

#### Example:

```ts
const params = {
  operatorAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.updateEigenPodOperator(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.updateEigenPodOperator.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.updateEigenPodOperator.estimateGas(params)
```
---
### `sdk.vault.operate`

#### Description:

Updates the vault by authorized personnel such as the vault admin, whitelistManager, blocklist manager, validators manager, or deposit-data manager.


#### Arguments:

| Name             | Type                                         | Required | Access            | Description                                                                                                                 |
|------------------|----------------------------------------------|----------|-------------------|-----------------------------------------------------------------------------------------------------------------------------|
| whitelistManager   | `Array<{ address: string, isNew: boolean }>` | **No** | whitelistManager  | List of addresses to update the whitelist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one. Max count at time - 700 addresses. |
| blocklist          | `Array<{ address: string, isNew: boolean }>` | **No** | Blocklist manager | List of addresses to update the blocklist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one. Max count at time  - 700 addresses. |
| depositDataManager | `string` | **No**  | Deposit-data manager | Address of the vault keys manager. Support only **first version** on valults. For second verion use `vault.setDepositDataManager` |
| validatorsManager  | `string` | **No**  | Admin                | Address of the vault deposit data manager. Support only **second version** on valults. |
| restakeWithdrawalsManager  | `string` | **No**  | Admin                | The restake withdrawals manager must be assigned to the wallet connected to the operator service. It is responsible for withdrawing exiting validators from the EigenLayer. |
| restakeOperatorsManager  | `string` | **No**  | Admin                | The restake operators manager can add EigenPods and update EigenLayer operators. |
| whitelistManager   | `string` | **No**  | Admin                | Address of the vault whitelistManager |
| feeRecipient       | `string` | **No**  | Admin                | Address of the vault fee recipient |
| validatorsRoot     | `string` | **No**  | Keys manager         | The vault validators merkle tree root. Support only **first version** on valults. For second verion use `vault.setDepositDataRoot` |
| blocklistManager   | `string` | **No**  | Admin                | The blocklisted vault blocklist manager |
| metadataIpfsHash   | `string` | **No**  | Admin                | The vault metadata IPFS hash |
| userAddress        | `string` | **Yes** | -                    | The address of the user making the update (admin, whitelist manager, blocklist manager or keys manager) |
| vaultAddress       | `string` | **Yes** | -                    | The address of the vault  |

#### Example:

```ts
// Data to update the vault by admin.
const params = {
  userAddress: '0x...',
  vaultAddress: '0x...',
  feeRecipient: '0x...',
  metadataIpfsHash: '...',
  validatorsRoot: '0x...',
  blocklistManager: '0x...',
  whitelistManager: '0x...',
  validatorsManager: '0x...',
  depositDataManager: '0x...',
  restakeOperatorsManager: '0x...',
  restakeWithdrawalsManager: '0x...',
  
}

// Data to update the vault by vault keys manager.
const params = {
  validatorsRoot: '...',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Data to update the private vault by whitelist manager.
// The whitelist contains addresses allowed to stake or mint within
// the vault.
const params = {
  whitelist: [
    {
      address: '0x...',
      isNew: true,
    },
    {
      address: '0x...',
      isNew: false,
    },
  ],
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Data to update blocklisted vault by blocklist manager. 
// The blocklist contains addresses disallowed to stake or mint within
// the vault.
const params = {
  blocklist: [
    {
      address: '0x...',
      isNew: true,
    },
    {
      address: '0x...',
      isNew: false,
    },
  ],
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.operate(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.operate.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.operate.estimateGas(params)
```
---
### `sdk.osToken.mint`

#### Description:

Getting osToken. The amount of token you can get depends on the user's current deposit in the vault. 
Use data from methods [sdk.osToken.getMaxMint](#sdkostokengetmaxmint) and [sdk.osToken.getHealthFactor](#sdkostokengethealthfactor) to block a call to mint() if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction would make the position unhealthy

#### Arguments:

| Name         | Type     | Required | Description |
|--------------|----------|----------|-------------|
| shares       | `bigint` | **Yes**  | mint amount |
| userAddress  | `string` | **Yes**  | -           |
| vaultAddress | `string` | **Yes**  | -           |

#### Example:

```ts
import { OsTokenPositionHealth } from '@stakewise/v3-sdk'

const amountShares = 200n // from input mb

const [
  { ltvPercent, thresholdPercent },
  stake,
] = await Promise.all([
  sdk.osToken.getConfig(),
  sdk.vault.getStakeBalance({
    vaultAddress: '0x...',
    userAddress: '0x...',
  }),
])

const osToken = await sdk.osToken.getPosition({
  stakedAssets: stake.assets,
  vaultAddress: '0x...',
  userAddress: '0x...',
  thresholdPercent,
})

const maxMint = await sdk.osToken.getMaxMint({
  mintedAssets: osToken.minted.assets,
  stakedAssets: stake.assets,
  vaultAddress: '0x...',
  ltvPercent,
})

if (amountShares > maxMint) {
  // The value of amountShares is more than we can mint
  return
}

const newMintShares = osToken.minted.shares + amountShares
const newMintAssets = await sdk.osToken.getAssetsFromShares({
  amount: newMintShares
})

const { health } = sdk.osToken.getHealthFactor({
  thresholdPercent,
  stakedAssets: stake.assets,
  mintedAssets: newMintAssets,
})

if (health !== OsTokenPositionHealth.Healthy) {
  // If you do a minting with so many amountShares, your position is no longer healthy
  return
}

const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  shares: amountShares,
}

// Send transaction
const hash = await sdk.osToken.mint(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.osToken.mint.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.osToken.mint.estimateGas(params)
```
---
### `sdk.osToken.burn`

#### Description:

Burns your osToken

#### Arguments:

| Name         | Type     | Required | Description |
|--------------|----------|----------|-------------|
| shares       | `bigint` | **Yes**  | Burn amount |
| userAddress  | `string` | **Yes**  | -           |
| vaultAddress | `string` | **Yes**  | -           |

#### Example:

```ts
const params = {
  shares: 0n,
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Send transaction
const hash = await sdk.osToken.burn(params)
// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.osToken.burn.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.osToken.burn.estimateGas(params)
```
---
### `sdk.rewardSplitter.create`

#### Description:

Creates a reward splitter contract to distribute vault rewards among multiple fee recipients in predefined proportions.
Subsequently, the address of the created reward splitter must be added to the vault as a fee recipient in order to
utilize it. Please note that only vault admin is permitted to perform this action.


#### Arguments:
| Name         | Type     | Required | Description                                                                                                                          |
|--------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| userAddress  | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| vaultAddress | `string` | **Yes**  | The address of the vault                                                                                                             |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.rewardSplitter.create(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.create.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.create.estimateGas(params)
```
---
### `sdk.rewardSplitter.claimRewards`

#### Description:

Claims rewards from the reward splitter contract

#### Arguments:
| Name                  | Type     | Required | Description                                                                                                                          |
|-----------------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| vaultAddress          | `string` | **Yes**  | The address of the vault                                                                                                             |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter                                                                                                   |
| assets                | `bigint` | **Yes**  | The amount of assets to claim                                                                                                        |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
  assets: parseEther('100'),
}

// Send transaction
const hash = await sdk.rewardSplitter.claimRewards(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.claimRewards.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.claimRewards.estimateGas(params)
```
---
### `sdk.rewardSplitter.updateFeeRecipients`

#### Description:

Updates the reward splitter fee recipients and predefined fee splitting proportions.
Please note that only the vault admin, who is also the owner of the reward splitter, is permitted to perform this action.


#### Arguments:

| Name                  | Type                                         | Required | Description                                                                                                                                                                                                                                                                                         |
|-----------------------|----------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| userAddress           | `string`                                     | **Yes**  | The address of the user initiating the action. It should be the vault admin, who is also the owner of the reward splitter.                                                                                                                                                                          |
| vaultAddress          | `string`                                     | **Yes**  | The address of the vault                                                                                                                                                                                                                                                                            |
| rewardSplitterAddress | `string`                                     | **Yes**  | The address of the reward splitter                                                                                                                                                                                                                                                                  |
| feeRecipients         | `Array<{ address: string, shares: bigint }>` | **Yes**  | The list of the vault fee recipients with their addresses and shares amount. For simplicity, we suggest setting the amount as a percentage converted to a BigInt value. For example, for 100% shares: `parseEther('100')`                                                                           |
| oldFeeRecipients      | `Array<{ address: string, shares: bigint }>` | **No**   | The current list of the vault fee recipients that will be updated within this action. It is needed to calculate how many shares will be added or removed from each fee recipient. If not provided, it will be requested from the [sdk.vault.getRewardSplitters](#sdkvaultgetrewardsplitters) action |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
  feeRecipients: [
    {
      address: '0x...1', // The fee for this address will be increased from 20% to 50%.
      shares: parseEther('50'),
    },
    {
      address: '0x...4', // This address will be added as a fee recipient with 50% fee distribution.
      shares: parseEther('50'),
    },
  ],
  oldFeeRecipients: [
    {
      address: '0x...1', // The fee for this address will be increased from 20% to 50%.
      shares: parseEther('20'),
    },
    {
      address: '0x...2', // This address will be removed from the fee recipients since it is not in the `feeRecipients` list.
      shares: parseEther('40'),
    },
    {
      address: '0x...3', // This address will also be removed from the fee recipients.
      shares: parseEther('40'),
    },
  ],
}

// Send transaction
const hash = await sdk.rewardSplitter.updateFeeRecipients(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.updateFeeRecipients.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.updateFeeRecipients.estimateGas(params)
```
---

## Description of other parts of the api

To retrieve the storage data, you just need the method above. Other parts of the api are needed for specific tasks.

### StakeWise class

| Name                        | Description                                                           |
|-----------------------------|-----------------------------------------------------------------------|
| **contracts**               | Instances of our contracts                                            |
| **vaultMulticall**          | A method to implement a transaction with vault update                 |
| **rewardSplitterMulticall** | A method to implement a reward splitter transaction with vault update |
| **config**                  | Object with contract addresses and other data                         |
| **provider**                | Current provider for blockchain communication                         |
| **network**                 | Selected network                                                      |

### SDK

| Name               | Description                                               |
|--------------------|-----------------------------------------------------------|
| **BigDecimal**     | Wrapper over bignumber.js                                 |
| **configs**        | Data for each network                                     |
| **createContract** | A wrapper over the Contract class from the ethers package |
