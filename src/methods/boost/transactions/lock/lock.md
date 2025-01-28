---
id: lock
slug: /boost/transactions/lock
---

#### Description:

Boost your osToken apy using leverage staking

#### Arguments:

| Name            | Type           | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-----------------|----------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| amount          | `bigint`       | **Yes**  | Boost amount                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| userAddress     | `string`       | **Yes**  | The user address                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| vaultAddress    | `string`       | **Yes**  | The address of the vault that will mint osTokens for leverage staking                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| boostAddress    | `string`       | **Yes**  | The address of the strategy proxy using the [sdk.boost.getLeverageStrategyProxy](/boost/requests/getleveragestrategyproxy) method                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| referrerAddress | `string`       | **No**   | The address of the referrer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| permitParams    | `PermitParams` | **No**   | The permit signature is required if there isn’t enough osToken allowance for the strategy proxy contract.<br /><br />**For MultiSig**<br />The permit signature is not necessary for Multi Sig (e.g. Safe Wallet), as it should use `sdk.contracts.mintToken.approve(boostAddress, MaxUint256)` instead of a permit call to set up osToken allowance. This will be called in the action if needed.<br /><br />**For other wallets**<br />The permit signature is optional since it will be obtained automatically using the [utils.getPermitSignature](/utils/getpermitsignature) method. |

```ts
type PermitParams = {
  vault: string
  amount: bigint
  deadline: number
  v: number
  r: string
  s: string
}
```

#### Example:

```ts
const params = {
  amount: parseEther('1'),
  userAddress: '0x...',
  vaultAddress: '0x...',
  boostAddress: '0x...',
}

// Send transaction
const hash = await sdk.boost.lock(params)
// When you sign transactions on the backend (for custodians)
// `lockTxData` will always be returned, while `approveTxData` will only be returned for MultiSig e.g. Safe Wallet
// if there isn’t enough osToken allowance, otherwise it will be null
const { lockTxData, approveTxData } = await sdk.boost.lock.encode(params)

// Get an approximate gas per transaction
const gas = await sdk.boost.lock.estimateGas(params)
```
