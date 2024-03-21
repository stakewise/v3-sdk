<p align="center">
  <img src="https://app.stakewise.io/logo512.png" alt="StakeWise Logo" width="100">
</p>

# StakeWise Labs V3 SDK

The official SDK designed for effortless data retrieval from the StakeWise platform. This SDK provides a streamlined interface over GraphQL requests and contract interactions.

![Version](https://img.shields.io/npm/v/@stakewise/v3-sdk)
![Size](https://img.shields.io/bundlephobia/min/@stakewise/v3-sdk?label=Size)
![Unit Tests](https://github.com/stakewise/v3-sdk/actions/workflows/unit-tests.yml/badge.svg)
![GitHub issues](https://img.shields.io/github/issues-raw/stakewise/v3-sdk)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/stakewise/v3-sdk)
![GitHub forks](https://img.shields.io/github/forks/stakewise/v3-sdk)
![Ethers version](https://img.shields.io/badge/ethers-6.7.1-purple)

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [API - Vault](#api-vault)
- [API - osToken](#api-ostoken)
- [API - Utils](#api-utils)
- [API - Transactions](#transactions)

## Prerequisites

For successful utilization of this library, ensure you have `ethers` version 6.7.1 or higher installed. The `ethers` package isn't bundled within the SDK. Instead, we leverage `peerDependencies` to maintain a lean package size.

**Note**: If your project uses version 5 of `ethers`, consider installing version 6 alongside it. Adjust import paths via a bundler. Additionally, you might consider loading our SDK asynchronously using dynamic imports to optimize your application's initial load performance. Here's a sample configuration with webpack:

`npm i ethers-6@npm:ethers@6.7.1`

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

| Name | Type | Required | Description |
|------|------|-------------|---------|
| network | `Network` | **Yes** | Chain id |
| provider | `BrowserProvider or JsonRpcProvider` | **No** | You can provide your implementation of the provender for ethers |
| endpoints.web3 | `string OR string[]` | **No** | Your urls for connect to blockchain |
| endpoints.subgraph | `string` | **No** | stakewise sbugraph url |
| endpoints.api | `string` | **No** | stakewise backend url |

## Quick Links

##### Request table:
| **Vault**                                                         | **osToken**                                                     | **Utils** |
|-------------------------------------------------------------------|-----------------------------------------------------------------|------|
| [sdk.vault.getStakerActions](#sdkvaultgetstakeractions)           | [sdk.osToken.getBurnAmount](#sdkostokengetburnamount)           | [sdk.utils.getSwiseUsdPrice](#sdkutilsgetswiseusdprice) |
| [sdk.vault.getSnapshots](#sdkvaultgetsnapshots)                   | [sdk.osToken.getHealthFactor](#sdkostokengethealthfactor)       | [sdk.utils.getTransactions](#sdkutilsgettransactions) |
| [sdk.vault.getExitQueuePositions](#sdkvaultgetexitqueuepositions) | [sdk.osToken.getAPY](#sdkostokengetapy)                         |
| [sdk.vault.getValidators](#sdkvaultgetvalidators)                 | [sdk.osToken.getPosition](#sdkostokengetposition)               |
| [sdk.vault.getVault](#sdkvaultgetvault)                           | [sdk.osToken.getMaxMint](#sdkostokengetmaxmint)                 | 
| [sdk.vault.getMaxWithdraw](#sdkvaultgetmaxwithdraw)               | [sdk.osToken.getBaseData](#sdkostokengetbasedata)               |
| [sdk.vault.getHarvestParams](#sdkvaultgetharvestparams)           | [sdk.osToken.getSharesFromAssets](#sdkostokengetsharesfromassets) |
| [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance)             | [sdk.osToken.getAssetsFromShares](#sdkostokengetassetsfromshares) |
| [sdk.vault.getUserRewards](#sdkvaultgetuserrewards)               | [sdk.vault.getScorePercentiles](#sdkvaultgetscorepercentiles)   
| [sdk.vault.getWhitelist](#sdkvaultgetwhitelist)                   
| [sdk.vault.getBlocklist](#sdkvaultgetblocklist)                   

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
| **Vault**                                             | **osToken** |
|-------------------------------------------------------|------|
| [sdk.vault.deposit](#sdkvaultdeposit)                 | [sdk.osToken.mint](#sdkostokenmint) |
| [sdk.vault.withdraw](#sdkvaultwithdraw)               | [sdk.osToken.burn](#sdkostokenburn) |
| [sdk.vault.claimExitQueue](#sdkvaultclaimexitqueue)   |
| [sdk.vault.updateWhitelist](#sdkvaultupdatewhitelist) |
| [sdk.vault.updateBlocklist](#sdkvaultupdateblocklist)     |

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

| Name | Type              | Type        | Description |
|------|-------------------|-------------|---|
| vaultAddress | `string`          | **Yes** | - |
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

| Name | Type | Required |
|------|------|-------------|
| vaultAddress | `string` | **Yes** | 
| limit | `number` | **Yes** | To implement pagination |
| skip | `number` | **Yes** | To implement pagination |

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
  isErc20: boolean
  capacity: string
  createdAt: number
  feePercent: number
  isPrivate: boolean
  vaultAdmin: string
  totalAssets: string
  feeRecipient: string
  whitelister: string
  vaultAddress: string
  mevRecipient: string
  whitelistCount: number
  blocklistCount: number
  imageUrl: string | null
  blocklistManager: string
  vaultKeysManager: string
  isSmoothingPool: boolean
  tokenName: string | null
  tokenSymbol: string | null
  displayName: string | null
  description: string | null
  performance: number
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
| `isBlocklist`      | Whether the storage has blocklist                             |
| `vaultAdmin`       | Vault administrator address                                   |
| `totalAssets`      | TVL of Vault                                                  |
| `feeRecipient`     | Vault fee address                                             |
| `whitelister`      | Whitelist manager                                             |
| `vaultAddress`     | Address of vault                                              |
| `mevRecipient`     | Validator fee recipient                                       |
| `whitelistCount`   | Number of addresses in the [whitelist](#sdkvaultgetwhitelist) |
| `blocklistCount`   | Number of addresses in the [blocklist](#sdkvaultgetblocklist) |
| `imageUrl`         | Link for vault logo                                           |
| `blocklistManager` | Blocklist manager                                             |
| `vaultKeysManager` | Keys manager address                                          |
| `isSmoothingPool`  | Smoothing poll or Vault escrow                                |
| `tokenName`        | ERC20 token name                                              |
| `tokenSymbol`      | ERC20 token symbol                                            |
| `displayName`      | Name of vault                                                 |
| `description`      | Description of vault                                          |
| `whitelist`        | List of authorized users for deposits                         |
| `blocklist`        | List of blocked users for deposits                            |
| `performance`      | Vault performance indicator (percent)                         |

#### Example:

```ts
await sdk.vault.getVault({ vaultAddress: '0x...' })
```
---
### `sdk.vault.getMaxWithdraw`

#### Description:

How much a user can withdraw

#### Arguments:

| Name | Type | Required | Info |
|------|------|-------------|-------|
| ltvPercent | `bigint` | **Yes** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
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
| ltvPercent | `bigint` | **Yes** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
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
})
```
---
### `sdk.osToken.getHealthFactor`

#### Description:

Get the health of the position

#### Arguments:
| Name | Type | Required | Description |
|------|------|-------------|---------|
| thresholdPercent | `bigint` | **Yes** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
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

Os token average rewards per second

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
| thresholdPercent | `bigint` | **Yes** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
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
| ltvPercent | `bigint` | **Yes** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
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
})
```
---
### `sdk.osToken.getBaseData`

#### Description:

Basic information on the token

#### Returns:

```ts
type Output = {
  rate: string
  ltvPercent: bigint
  thresholdPercent: bigint
}
```
| Name | Description |
|------|-------------|
| `rate` | ETH - osToken rate |
| `ltvPercent` | The percent used to calculate how much user can mint OsToken shares |
| `thresholdPercent` | The liquidation threshold percent used to calculate health factor for OsToken position |

#### Example:

```ts
await sdk.osToken.getBaseData()
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

| Name | Type | Required | Description |
|------|------|-------------|---------|
| hash | `string` | **Yes** | Transaction hash |

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

| Name | Type | Required | Description |
|------|------|-------------|---------|
| assets | `bigint` | **Yes** | Deposit amount |
| userAddress | `string` | **Yes** | - |
| vaultAddress | `string` | **Yes** | - |

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

| Name | Type | Required | Description |
|------|------|-------------|---------|
| assets | `bigint` | **Yes** | Withdraw amount |
| userAddress | `string` | **Yes** | - |
| vaultAddress | `string` | **Yes** | - |

#### Example:

```ts
const amountAssets = 200n // from input mb

const [
  { ltvPercent, thresholdPercent },
  stake,
] = await Promise.all([
  sdk.osToken.getBaseData(),
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

| Name | Type | Required | Description |
|------|------|-------------|---------|
| positions | `string` | **Yes** | `postions` from [sdk.vault.getExitQueuePositions](#sdkvaultgetexitqueuepositions) |
| userAddress | `string` | **Yes** | - |
| vaultAddress | `string` | **Yes** | - |

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
### `sdk.vault.updateWhitelist`

#### Description:

Update the whitelist of addresses for a private vault.
The whitelist contains addresses allowed to stake or mint within
the private vault. This method can only be called by the vault
access manager.


#### Arguments:

| Name | Type                                         | Required | Description                                                                                                                 |
|------|----------------------------------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------|
| whitelist | `Array<{ address: string, isNew: boolean }>` | **Yes** | List of addresses to update the whitelist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one |
| userAddress | `string`                                     | **Yes** | The address of the user making the update (access manager)                                                                                 |
| vaultAddress | `string`                                     | **Yes** | The address of the private vault                                                                                            |

#### Example:

```ts
const whitelist = [
  {
    address: '0x...',
    isNew: true,
  },
  {
    address: '0x...',
    isNew: false,
  },
]

const params = {
  whitelist,
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.updateWhitelist(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.updateWhitelist.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.updateWhitelist.estimateGas(params)
```
---
### `sdk.vault.updateBlocklist`

#### Description:

Update the blocklist of addresses for a blocklisted vault.
The blocklist contains addresses disallowed to stake or mint within
the blocklisted vault. This method can only be called by the vault
access manager.

#### Arguments:

| Name         | Type                                         | Required | Description                                                                                                                  |
|--------------|----------------------------------------------|-------------|------------------------------------------------------------------------------------------------------------------------------|
| blocklist    | `Array<{ address: string, isNew: boolean }>` | **Yes** | List of addresses to update the blocklist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one  |
| userAddress  | `string`                                     | **Yes** | The address of the user making the update (access manager)                                                                   |
| vaultAddress | `string`                                     | **Yes** | The address of the blocklisted vault                                                                                         |

#### Example:

```ts
const blocklist = [
  {
    address: '0x...',
    isNew: true,
  },
  {
    address: '0x...',
    isNew: false,
  },
]

const params = {
  blocklist,
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.updateBlocklist(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.updateBlocklist.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.updateBlockList.estimateGas(params)
```
---
### `sdk.osToken.mint`

#### Description:

Getting osToken. The amount of token you can get depends on the user's current deposit in the storage. 
Use data from methods [sdk.osToken.getMaxMint](#sdkostokengetmaxmint) and [sdk.osToken.getHealthFactor](#sdkostokengethealthfactor) to block a call to mint() if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction would make the position unhealthy

#### Arguments:

| Name | Type | Required | Description |
|------|------|-------------|---------|
| shares | `bigint` | **Yes** | mint amount |
| userAddress | `string` | **Yes** | - |
| vaultAddress | `string` | **Yes** | - |

#### Example:

```ts
import { OsTokenPositionHealth } from '@stakewise/v3-sdk'

const amountShares = 200n // from input mb

const [
  { ltvPercent, thresholdPercent },
  stake,
] = await Promise.all([
  sdk.osToken.getBaseData(),
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

| Name | Type | Required | Description |
|------|------|-------------|---------|
| shares | `bigint` | **Yes** | Burn amount |
| userAddress | `string` | **Yes** | - |
| vaultAddress | `string` | **Yes** | - |

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

## Description of other parts of the api

To retrieve the storage data, you just need the method above. Other parts of the api are needed for specific tasks.

### StakeWise class

| Name | Description |
|------|-------------|
| **contracts** | Instances of our contracts |
| **vaultMulticall** | A method to implement a transaction with vault update |
| **config** | Object with contract addresses and other data |
| **provider** | Current provider for blockchain communication |
| **network** | Selected network |

### SDK

| Name | Description |
|------|------|
| **BigDecimal** | Wrapper over bignumber.js |
| **configs** | Data for each network |
| **createContract** | A wrapper over the Contract class from the ethers package |
