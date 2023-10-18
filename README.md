<p align="center">
  <img src="https://app.stakewise.io/logo512.png" alt="StakeWise Logo" width="100">
</p>

# StakeWise Labs V3 SDK

The official SDK designed for effortless data retrieval from the StakeWise platform. This SDK provides a streamlined interface over GraphQL requests and contract interactions.

![Version](https://img.shields.io/badge/version-1.2.6-blue)
![Unit Tests](https://github.com/stakewise/v3-sdk/actions/workflows/unit-tests.yml/badge.svg)
![GitHub issues](https://img.shields.io/github/issues-raw/stakewise/v3-sdk)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/stakewise/v3-sdk)
![Ethers version](https://img.shields.io/badge/ethers-6.7.1-purple)

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [API - Vault](#api-vault)
- [API - osToken](#api-ostoken)
- [API - Utils](#api-utils)

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

Create SDK instance

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({ network: Network.Mainnet })

```
#### SDK Constructor Arguments:

| Name | Type | Type | Description |
|------|------|-------------|---------|
| network | `Network` | **Require** | Chain id |
| provider | `any` | **Optional** | You can provide your implementation of the provender for ethers |
| endpoints.subgraph | `string` | **Optional** | stakewise sbugraph url |
| endpoints.web3 | `number` | **Optional** | Your url for connect to blockchian |
| endpoints.api | `string` | **Optional** | stakewise backend url |

## Quick Links
| **Vault** | **osToken** | **Utils** |
|------|------|------|
| [sdk.vault.getAllocatorActions](#sdkvaultgetallocatoractions) | [sdk.osToken.getBurnAmount](#sdkostokengetburnamount) | [sdk.utils.getRewardsPerYear](#sdkutilsgetrewardsperyear) |
| [sdk.vault.getDaySnapshots](#sdkvaultgetdaysnapshots) | [sdk.osToken.getHealthFactor](#sdkostokengethealthfactor) | [sdk.utils.getSwiseUsdPrice](#sdkutilsgetswiseusdprice) |
| [sdk.vault.getExitQueue](#sdkvaultgetexitqueue) | [sdk.osToken.getAPY](#sdkostokengetapy) | [sdk.utils.getTransactions](#sdkutilsgettransactions) |
| [sdk.vault.getValidators](#sdkvaultgetvalidators) | [sdk.osToken.getPosition](#sdkostokengetposition) | [sdk.utils.getAssetsFromShares](#sdkutilsgetassetsfromshares) |
| [sdk.vault.getVault](#sdkvaultgetvault) | [sdk.osToken.getMaxMint](#sdkostokengetmaxmint) | [sdk.utils.getSharesFromAssets](#sdkutilsgetsharesfromassets) |
| [sdk.vault.getWithdrawData](#sdkvaultgetwithdrawdata) | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
| [sdk.vault.getHarvestParams](#sdkvaultgetharvestparams) |
| [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |

## API-Vault

### `sdk.vault.getAllocatorActions`

#### Description:

Get a list of interactions with the vault.

#### Arguments:

| Name | Type | Type | Description |
|------|------|-------------|---------|
| vaultAddress | `string` | **Require** | - |
| userAddress | `string` | **Optional** | If a user address is specified, the query will look for events for that address and the vault address only |
| types | `AllocatorActionType` | **Require** | Event types can be found in `enum AllocatorActionType` which you can import from the library |
| limit | `number` | **Require** | To implement pagination |
| skip | `number` | **Require** | To implement pagination |

#### Returns:

```ts
type Output = Array<{
  actionType: AllocatorActionType
  createdAt: number
  assets: string
  link: string
  id: string
}>
```

| Name | Description |
|------|-------------|
| `id` | Event identifier |
| `assets` | Transaction amount |
| `createdAt` | Transaction date |
| `actionType` | Type of action |
| `link` | Transaction link (etherscan/blockscout) |

#### Example:

```ts
import { AllocatorActionType } from '@stakewise/v3-sdk'

await sdk.vault.getAllocatorActions({
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
### `sdk.vault.getDaySnapshots`

#### Description:

TVL and APY snapshots for the vault. With the help of this data it is possible to build a chart.

#### Arguments:

| Name | Type | Type | Description |
|------|------|-------------|---------|
| unixStartOfDay | `number` | **Require** | Time to start |
| vaultAddress | `string` | **Require** | - |

#### Returns:

```ts
type DaySnapshot = {
  APY: number
  TVL: string
}

type Output = {
  days: Record<number, DaySnapshot>
  first: DaySnapshot
}
```

| Name | Description |
|------|-------------|
| `days` | The result of the query on your parameters, is returned as an object where the keys are timestamps |
| `first` | We always send the very first saved snapshot regardless of the request parameters, this helps for rendering the chart |

#### Example:

```ts
await sdk.vault.getDaySnapshots({
  vaultAddress: '0x...',
  unixStartOfDay: 1695730032793,
})
```
---
### `sdk.vault.getExitQueue`

#### Description:

Returns the withdrawal queue for a specific user.

#### Arguments:

| Name | Type | Type |
|------|------|-------------|
| userAddress | `string` | **Require** |
| vaultAddress | `string` | **Require** | 

#### Returns:

```ts
type Position = {
  exitQueueIndex: bigint
  positionTicket: string
}

type Output = {
  total: bigint
  data: Position[]
  withdrawable: bigint
}
```

| Name | Description |
|------|-------------|
| `data` | Queue positions |
| `total` | Total withdrawal amount (in ETH) |
| `withdrawable` | Amount available for withdrawal (in ETH) |

#### Example:

```ts
await sdk.vault.getExitQueue({
  vaultAddress: '0x...',
  userAddress: '0x...',
})
```
---
### `sdk.vault.getValidators`

#### Description:

Returns the running vault validators.

#### Arguments:

| Name | Type | Type |
|------|------|-------------|
| vaultAddress | `string` | **Require** | 

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
await sdk.vault.getValidators({ vaultAddress: '0x...' })
```
---
### `sdk.vault.getVault`

#### Description:

Returns the master data of the vault

#### Arguments:

| Name | Type | Type |
|------|------|-------------|
| vaultAddress | `string` | **Require** | 

#### Returns:

```ts
type Output = {
  apy: number
  isErc20: boolean
  capacity: string
  verified: boolean
  createdAt: number
  feePercent: number
  isPrivate: boolean
  vaultAdmin: string
  totalAssets: string
  feeRecipient: string
  whitelister: string
  vaultAddress: string
  mevRecipient: string
  imageUrl: string | null
  vaultKeysManager: string
  isSmoothingPool: boolean
  tokenName: string | null
  tokenSymbol: string | null
  displayName: string | null
  description: string | null
  whitelist: Array<{
    createdAt: number
    address: string
  }> | null
  performance: {
    total: number
  }
}
```

| Name | Description |
|------|-------------|
| `apy` | Current vault apy  |
| `isErc20` | Does the vault have its own ERC20 token  |
| `capacity` | Maximum TVL of Vault |
| `verified` | Has the vault been verified  |
| `createdAt` | Date of Creation  |
| `feePercent` | Commission rate  |
| `isPrivate` | Whether the storage is private  |
| `vaultAdmin` | Vault administrator address  |
| `totalAssets` | TVL of Vault  |
| `feeRecipient` | Vault fee address  |
| `whitelister` | Whitelist manager  |
| `vaultAddress` | Address of vault  |
| `mevRecipient` | Validator fee recipient  |
| `imageUrl` | Link for vault logo  |
| `vaultKeysManager` | Keys manager address  |
| `isSmoothingPool` | Smoothing poll or Vault escrow |
| `tokenName` | ERC20 token name  |
| `tokenSymbol` | ERC20 token symbol  |
| `displayName` | Name of vault  |
| `description` | Description of vault |
| `whitelist` | List of authorized users for deposits  |
| `performance` | Vault performance indicator |

#### Example:

```ts
await sdk.vault.getVault({ vaultAddress: '0x...' })
```
---
### `sdk.vault.getWithdrawData`

#### Description:

Withdrawal details

#### Arguments:

| Name | Type | Type | Info |
|------|------|-------------|-------|
| ltvPercent | `bigint` | **Require** | [getBaseData](#sdkostokengetbasedata) |
| userAddress | `string` | **Require** | - |
| vaultAddress | `string` | **Require** | - |
| mintedAssets | `bigint` | **Require** | [getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Require** | [getStakeBalance](#sdkvaultgetstakebalance) |

#### Returns:

```ts
type Output = {
  availableAssets: bigint
  maxWithdrawAssets: bigint
}
```

| Name | Description |
|------|-------------|
| `availableAssets` | Available for withdrawal instantly |
| `maxWithdrawAssets` | Maximum available for withdrawal |

#### Example:

```ts
await sdk.vault.getWithdrawData({
  ltvPercent: 0n,
  mintedAssets: 0n,
  stakedAssets: 0n,
  userAddress: '0x...',
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

| Name | Type | Type |
|------|------|-------------|
| userAddress | `string` | **Require** |
| vaultAddress | `string` | **Require** |

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
## API-osToken

### `sdk.osToken.getBurnAmount`

#### Description:

How many osToken burn do you need to make to withdraw all deposit.

#### Arguments:
| Name | Type | Type | Description |
|------|------|-------------|---------|
| ltvPercent | `bigint` | **Require** | [getBaseData](#sdkostokengetbasedata) |
| mintedAssets | `bigint` | **Require** | [getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Require** | [getStakeBalance](#sdkvaultgetstakebalance) |
| newStakedAssets | `bigint` | **Require** | The future amount of stake after the deposit |

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
| Name | Type | Type | Description |
|------|------|-------------|---------|
| thresholdPercent | `bigint` | **Require** | [getBaseData](#sdkostokengetbasedata) |
| mintedAssets | `bigint` | **Require** | [getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Require** | [getStakeBalance](#sdkvaultgetstakebalance) |

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

Token reward data

#### Returns:

```ts
type Output = {
  apy: string;
  averageRewardsPerSecond: bigint;
}
```

| Name | Description |
|------|-------------|
| `apy` | Current APY |
| `averageRewardsPerSecond` | 2-week average of awards per second |

#### Example:

```ts
await sdk.osToken.getAPY()
```
---
### `sdk.osToken.getPosition`

#### Description:

User position data

#### Arguments:
| Name | Type | Type | Description |
|------|------|-------------|---------|
| thresholdPercent | `bigint` | **Require** | [getBaseData](#sdkostokengetbasedata) |
| stakedAssets | `bigint` | **Require** | [getStakeBalance](#sdkvaultgetstakebalance) |
| userAddress | `string` | **Require** | - |
| vaultAddress | `string` | **Require** | - |

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
| `healthFactor` | [getHealthFactor](#sdkostokengethealthfactor)  |
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
| Name | Type | Type | Description |
|------|------|-------------|---------|
| ltvPercent | `bigint` | **Require** | [getBaseData](#sdkostokengetbasedata) |
| stakedAssets | `bigint` | **Require** | [getStakeBalance](#sdkvaultgetstakebalance) |
| mintedAssets | `bigint` | **Require** | [getPosition](#sdkostokengetposition) |

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
## API-utils

### `sdk.utils.getRewardsPerYear`

#### Description:

Get a list of interactions with the vault.

#### Arguments:

| Name | Type | Type | Description |
|------|------|-------------|---------|
| amount | `string` | **Require** | Deposit amount |
| averageRewardsPerSecond | `string` | **Require** | [getAPY](#sdkostokengetapy) |

#### Returns:

```ts
type Output = string
```

#### Example:

```ts
sdk.utils.getRewardsPerYear({
  averageRewardsPerSecond: 0n,
  amount: 0n,
})
```
---
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

| Name | Type | Type | Description |
|------|------|-------------|---------|
| hash | `string` | **Require** | Transaction hash |

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
### `sdk.utils.getAssetsFromShares`

#### Description:

Convert osToken to ETH

#### Arguments:

| Name | Type | Type |
|------|------|-------------|
| amount | `bigint` | **Require** |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
await sdk.utils.getAssetsFromShares({ amount: 0n })
```
---
### `sdk.utils.getSharesFromAssets`

#### Description:

Convert ETH to osToken

#### Arguments:

| Name | Type | Type |
|------|------|-------------|
| amount | `bigint` | **Require** |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
await sdk.utils.getSharesFromAssets({ amount: 0n })
```
---
## Description of other parts of the api

To retrieve the storage data, you just need the method above. Other parts of the api are needed for specific tasks.

### StakeWise class

| Name | Description
|------|------|
| **contracts** | Instances of our contracts |
| **vaultMulticall** | A method to implement a transaction. It will be removed from the SDK in the future |
| **config** | Object with contract addresses and other data |
| **provider** | Current provider for blockchain communication |
| **network** | Selected network |

### SDK

| Name | Description
|------|------|
| **BigDecimal** | Wrapper over bignumber.js |
| **configs** | Data for each network |
| **createContract** | A wrapper over the Contract class from the ethers package |
