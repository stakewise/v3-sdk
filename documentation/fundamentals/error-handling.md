---
id: error-handling
title: Error handling
sidebar_position: 4
description: Catch SDK errors, decode contract reverts via error.name, debug failed transactions with the JSON payload in error.message, and inspect pre-flight argument validation errors.
---

# Error handling


Every SDK method validates arguments synchronously before any network call. Network errors (RPC, subgraph) and Solidity reverts come back as rejections from the returned promise.

## Catching transaction reverts

When a write reverts, the SDK wraps the underlying error in a `ContractError`. If the SDK can decode the Solidity revert reason, `error.name` becomes the contract error name (e.g. `ZeroSharesAmount`); `error.message` contains a JSON dump of `{ solidityError, to, from, data }` for debugging.

```typescript
import { parseEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: browserProvider,
})

try {
  await sdk.vault.deposit({
    vaultAddress: '0x...',
    userAddress: '0x...',
    assets: parseEther('1.0'),
    referrerAddress: '0x0000000000000000000000000000000000000000',
  })
}
catch (error: any) {
  console.error('revert reason:', error.name)
  console.error('debug payload:', error.message)
}
```

If the revert cannot be decoded (unknown error selector), `error.message` keeps the original payload. Copy `to` / `data` / `from` from there into Tenderly's [Simulator](https://dashboard.tenderly.co/explorer) for a human-readable call trace.

## Pre-flight argument validation

User-input mistakes throw synchronously before any network call:

| Symptom | Cause |
|---|---|
| `Provider or endpoints.web3 should be provided` | Init without a provider AND without `endpoints.web3` |
| `The "<name>" argument must be a valid address` | Address malformed |
| `The "<name>" argument must be of type bigint` | Number/string passed where bigint expected |
| `The "<name>" argument must be a valid 32-byte hex hash` | Tx hash malformed (e.g. wrong length) |
| `To send this transaction, please provide BrowserProvider to the StakeWiseSDK` | Calling default-form write on a read-only SDK |

For read-only flows, use `sdk.vault.<method>.encode(...)` (returns calldata) instead of the default form.
