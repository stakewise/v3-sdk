---
id: updateState
slug: /sdk/api/vault/transactions/updatestate
---

#### Description:

Update the state of a vault if required. This is used to update the state of a vault before a transaction has been executed.

#### Arguments:

| Name           | Type     | Required | Description               |
|----------------|----------|----------|---------------------------|
| userAddress    | `string` | **Yes**  | The user address          |
| vaultAddress   | `string` | **Yes**  | The address of the vault  |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
// Will return empty string if updateState is not required
const hash = await sdk.vault.updateState(params)
// When you sign transactions on the backend (for custodians)
// Will return empty object if updateState is not required
const { data, to } = await sdk.vault.updateState.encode(params)
// Get an approximate gas per transaction
// Will return 0n if updateState is not required
const gas = await sdk.vault.updateState.estimateGas(params)
```
