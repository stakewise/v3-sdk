<p align="center">
  <img src="https://app.stakewise.io/logo512.png" alt="StakeWise Logo" width="200">
</p>

# StakeWise Data SDK
The official SDK to seamlessly fetch data from StakeWise platform.

---

[![Unit Tests](https://img.shields.io/badge/Unit%20Tests-passing-brightgreen)](LINK_TO_YOUR_TEST_RESULTS)
[![Linting](https://img.shields.io/badge/Linting-passing-brightgreen)](LINK_TO_YOUR_LINTING_RESULTS)
[![Latest Version](https://img.shields.io/npm/v/YOUR_NPM_PACKAGE_NAME/latest)](https://www.npmjs.com/package/YOUR_NPM_PACKAGE_NAME)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/YOUR_NPM_PACKAGE_NAME)](https://www.npmjs.com/package/YOUR_NPM_PACKAGE_NAME)

---

## Table of Contents
- [Installation](#installation)
- [Methods](#methods)

---

## Installation

```bash
npm ....
```

## Methods

### `getAllocatorActions()`

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
