---
id: introduction
title: Introduction
sidebar_position: 1
---

## Requests

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

```typescript
const promise = sdk.vault.getWhitelist({
  vaultAddress: '0x...',
})

promise.abort()
```
## Transactions

Transactions work through the provider you sent when creating an instance of our SDK class.
Or, if you are a custodian, you can get the transaction data and sign it yourself.
Each transaction also gives you the opportunity to get an approximate gas for sending it.
For custodians, it is more reliable to calculate the gas yourself.
Each transaction has encode and estimateGas methods for your convenience
