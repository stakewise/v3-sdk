---
id: deposit
slug: /vault/transactions/deposit
---

#### Description:

Deposit (stake) in a vault

#### Arguments:

| Name         | Type     | Required | Description               |
|--------------|----------|----------|---------------------------|
| assets       | `bigint` | **Yes**  | Deposit amount            |
| userAddress  | `string` | **Yes**  | The user address          |
| vaultAddress | `string` | **Yes**  | The address of the vault  |

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
