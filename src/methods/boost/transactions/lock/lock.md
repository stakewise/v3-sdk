---
id: lock
---

#### Description:

Boost your osToken apy using leverage staking

#### Arguments:

| Name         | Type           | Required | Description                                                                                                                                                                                                                 |
|--------------|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| amount       | `bigint`       | **Yes**  | Boost amount                                                                                                                                                                                                                |
| userAddress  | `string`       | **Yes**  | The user address                                                                                                                                                                                                            |
| vaultAddress | `string`       | **Yes**  | The address of the vault that will mint osTokens for leverage staking                                                                                                                                                       |
| boostAddress | `string`       | **Yes**  | The address of the strategy proxy (TODO method)                                                                                                                                                                             |
| permitParams | `PermitParams` | **No**   | The permit signature it is required only if there is not enough osToken allowance for the strategy proxy contract. It will be obtained automatically using the [utils.getPermitSignature](/utils/getpermitsignature) method |

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
const { data, to, value } = await sdk.boost.lock.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.boost.lock.estimateGas(params)
```
