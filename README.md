<p align="center">
  <img src="https://app.stakewise.io/logo512.png" alt="StakeWise Logo" width="200">
</p>

# StakeWise V3 SDK

The official SDK for seamlessly pulling data from the StakeWise platform. It is a wrapper over graphql queries and contract queries. In the end you get the data in a convenient form 

[![Unit Tests](https://img.shields.io/badge/Unit%20Tests-passing-brightgreen)](LINK_TO_YOUR_TEST_RESULTS)
[![Linting](https://img.shields.io/badge/Linting-passing-brightgreen)](LINK_TO_YOUR_LINTING_RESULTS)
[![Latest Version](https://img.shields.io/npm/v/YOUR_NPM_PACKAGE_NAME/latest)](https://www.npmjs.com/package/YOUR_NPM_PACKAGE_NAME)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/YOUR_NPM_PACKAGE_NAME)](https://www.npmjs.com/package/YOUR_NPM_PACKAGE_NAME)



## Table of Contents
- [Requirements](#requirements)
- [Usage](#usage)
- [API](#api)

---
## Requirements
<span style="color:red">Installed ethers 6.6.7+ is required.</span> This package is not included in the library (peerDependencies are used), but must be installed in your application. In the future we will try to update the ethers library with the latest version in a timely manner. If you are using ethers 5 or less, there are 2 solutions:
1. Upgrade to ethers 6, it is much more convenient.
2. You can install ethers 6 version separately, but it will expand your bandle:

`npm i ethers-6@npm:ethers@6.6.7`

Now you have ethers of your version and ethers-6. Now we can swap the use of imports within our library. If you are using webpack, you can implement it this way:

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

## Usage

Install SDK
```bash
npm i @stakewise/v3-sdk
```

Create SDK instance

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({ network: Network.Mainnet })

```

## API

### `sdk.requests.getAllocatorActions()`

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

| Type | Description |
|------|-------------|
| `id` | event identifier |
| `assets` | transaction amount |
| `createdAt` | transaction date |
| `actionType` | one of AllocatorActionType |
| `link` | transaction link (etherscan/blockscout) |

#### Example:

```typescript
import { AllocatorActionType } from '@stakewise/v3-sdk'

sdk.requests.getAllocatorActions({
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
