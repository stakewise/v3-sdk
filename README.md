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

| Name | Type | Type | Description |
|------|------|-------------|---------|
| network | `Network` | **Require** | Chain id |
| provider | `BrowserProvider or JsonRpcProvider` | **Optional** | You can provide your implementation of the provender for ethers |
| endpoints.subgraph | `string` | **Optional** | stakewise sbugraph url |
| endpoints.web3 | `number` | **Optional** | Your url for connect to blockchain |
| endpoints.api | `string` | **Optional** | stakewise backend url |

## Quick Links

##### Request table:
| **Vault** | **osToken** | **Utils** |
|------|-------------|------|
| [sdk.vault.getStakerActions](#sdkvaultgetstakeractions) | [sdk.osToken.getBurnAmount](#sdkostokengetburnamount) | [sdk.utils.getRewardsPerYear](#sdkutilsgetrewardsperyear) |
| [sdk.vault.getVaultSnapshots](#sdkvaultgetvaultsnapshots) | [sdk.osToken.getHealthFactor](#sdkostokengethealthfactor) | [sdk.utils.getSwiseUsdPrice](#sdkutilsgetswiseusdprice) |
| [sdk.vault.getExitQueuePositions](#sdkvaultgetexitqueuepositions) | [sdk.osToken.getAPY](#sdkostokengetapy) | [sdk.utils.getTransactions](#sdkutilsgettransactions) |
| [sdk.vault.getValidators](#sdkvaultgetvalidators) | [sdk.osToken.getPosition](#sdkostokengetposition) |
| [sdk.vault.getVault](#sdkvaultgetvault) | [sdk.osToken.getMaxMint](#sdkostokengetmaxmint) | 
| [sdk.vault.getMaxWithdraw](#sdkvaultgetmaxwithdraw) | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
| [sdk.vault.getHarvestParams](#sdkvaultgetharvestparams) | [sdk.osToken.getSharesFromAssets](#sdkostokengetsharesfromassets) |
| [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) | [sdk.osToken.getAssetsFromShares](#sdkostokengetassetsfromshares) |
|[sdk.vault.getUserRewards](#sdkvaultgetuserrewards)|

##### Table of transactions:
| **Vault** | **osToken** |
|------|------|
| [sdk.vault.deposit](#sdkvaultdeposit) | [sdk.osToken.mint](#sdkostokenmint) |
| [sdk.vault.withdraw](#sdkvaultwithdraw) | [sdk.osToken.burn](#sdkostokenburn) |
| [sdk.vault.claimExitQueue](#sdkvaultclaimexitqueue) |

## API-Vault

### `sdk.vault.getStakerActions`

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
### `sdk.vault.getVaultSnapshots`

#### Description:

TVL and APY snapshots for the vault. With the help of this data it is possible to build a chart.

#### Arguments:

| Name         | Type     | Type            | Description |
|--------------|----------|-----------------|---------|
| vaultAddress | `string` | **Require**     | - |
| dateFrom     | `string` | **Require**     | Time to start |
| dateTo       | `string` | Time to end     |
| first        | `number` | Snapshots count |

#### Returns:

```ts
type VaultSnapshot = {
  APY: number
  TVL: string
}

type Output = {
  days: Record<number, VaultSnapshot>
  first: VaultSnapshot
}
```

| Name | Description |
|------|-------------|
| `days` | The result of the query on your parameters, is returned as an object where the keys are timestamps |
| `first` | We always send the very first saved snapshot regardless of the request parameters, this helps for rendering the chart |

#### Example:

```ts
await sdk.vault.getVaultSnapshots({
  vaultAddress: '0x...',
  dateFrom: 1695730032793,
})
```
---
### `sdk.vault.getUserRewards`

#### Description:

Daily rewards for the user who has made a deposit in the vault. With the help of this data it is possible to build a chart.

#### Arguments:

| Name | Type     | Type | Description |
|------|----------|-------------|---------|
| dateFrom | `string` | **Require** | Time to start |
| vaultAddress | `string` | **Require** | - |
| userAddress | `string` | **Require** | - |

#### Returns:

```ts
type UserReward = {
  sumRewards: number
  dailyRewards: number
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
### `sdk.vault.getExitQueuePositions`

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

| Name | Type | Type |
|------|------|-------------|
| vaultAddress | `string` | **Require** | 
| limit | `number` | **Require** | To implement pagination |
| skip | `number` | **Require** | To implement pagination |

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

| Name | Type | Type |
|------|------|-------------|
| vaultAddress | `string` | **Require** | 

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
  performance: number
}
```

| Name | Description |
|------|-------------|
| `apy` | Current vault apy  |
| `isErc20` | Does the vault have its own ERC20 token  |
| `capacity` | Maximum TVL of Vault |
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
| `performance` | Vault performance indicator (percent) |

#### Example:

```ts
await sdk.vault.getVault({ vaultAddress: '0x...' })
```
---
### `sdk.vault.getMaxWithdraw`

#### Description:

How much a user can withdraw

#### Arguments:

| Name | Type | Type | Info |
|------|------|-------------|-------|
| ltvPercent | `bigint` | **Require** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
| mintedAssets | `bigint` | **Require** | [sdk.osToken.getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Require** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |

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
---
## API-osToken

### `sdk.osToken.getBurnAmount`

#### Description:

How many osToken burn do you need to make to withdraw all deposit.

#### Arguments:
| Name | Type | Type | Description |
|------|------|-------------|---------|
| ltvPercent | `bigint` | **Require** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
| mintedAssets | `bigint` | **Require** | [sdk.osToken.getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Require** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |
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
| thresholdPercent | `bigint` | **Require** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
| mintedAssets | `bigint` | **Require** | [sdk.osToken.getPosition](#sdkostokengetposition) |
| stakedAssets | `bigint` | **Require** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |

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
| Name | Type | Type | Description |
|------|------|-------------|---------|
| thresholdPercent | `bigint` | **Require** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
| stakedAssets | `bigint` | **Require** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |
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
| Name | Type | Type | Description |
|------|------|-------------|---------|
| ltvPercent | `bigint` | **Require** | [sdk.osToken.getBaseData](#sdkostokengetbasedata) |
| stakedAssets | `bigint` | **Require** | [sdk.vault.getStakeBalance](#sdkvaultgetstakebalance) |
| mintedAssets | `bigint` | **Require** | [sdk.osToken.getPosition](#sdkostokengetposition) |

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
### `sdk.osToken.getSharesFromAssets`

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
## Transactions

Transactions work through the provider you sent when creating an instance of our SDK class. Or, if you are a custodian, you can get the transaction data and sign it yourself. Each transaction also gives you the opportunity to get an approximate gas for sending it. For custodians, it is more reliable to calculate the gas yourself. Each transaction has encode and estimateGas methods for your convenience

### `sdk.vault.deposit`

#### Description:

Deposit (stake) in a vault

#### Arguments:

| Name | Type | Type | Description |
|------|------|-------------|---------|
| assets | `bigint` | **Require** | Deposit amount |
| userAddress | `string` | **Require** | - |
| vaultAddress | `string` | **Require** | - |

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

| Name | Type | Type | Description |
|------|------|-------------|---------|
| assets | `bigint` | **Require** | Withdraw amount |
| userAddress | `string` | **Require** | - |
| vaultAddress | `string` | **Require** | - |

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

| Name | Type | Type | Description |
|------|------|-------------|---------|
| positions | `string` | **Require** | `postions` from [sdk.vault.getExitQueuePositions](#sdkvaultgetexitqueuepositions) |
| userAddress | `string` | **Require** | - |
| vaultAddress | `string` | **Require** | - |

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
### `sdk.osToken.mint`

#### Description:

Getting osToken. The amount of token you can get depends on the user's current deposit in the storage. 
Use data from methods [sdk.osToken.getMaxMint](#sdkostokengetmaxmint) and [sdk.osToken.getHealthFactor](#sdkostokengethealthfactor) to block a call to mint() if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction would make the position unhealthy

#### Arguments:

| Name | Type | Type | Description |
|------|------|-------------|---------|
| shares | `bigint` | **Require** | mint amount |
| userAddress | `string` | **Require** | - |
| vaultAddress | `string` | **Require** | - |

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

| Name | Type | Type | Description |
|------|------|-------------|---------|
| shares | `bigint` | **Require** | Burn amount |
| userAddress | `string` | **Require** | - |
| vaultAddress | `string` | **Require** | - |

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
