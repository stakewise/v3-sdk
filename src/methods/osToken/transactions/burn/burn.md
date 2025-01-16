---
id: burn
slug: /osToken/transactions/burn
---

#### Description:

Burns your osToken

#### Arguments:

| Name         | Type     | Required | Description               |
|--------------|----------|----------|---------------------------|
| shares       | `bigint` | **Yes**  | Burn amount               |
| userAddress  | `string` | **Yes**  | The user address          |
| vaultAddress | `string` | **Yes**  | The address of the vault  |

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
```
