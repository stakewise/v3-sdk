---
id: setDepositDataRoot
slug: /vault/transactions/setdepositdataroot
---

#### Description:

Adding root validators to vaults **version 2** or higher

#### Arguments:

| Name           | Type     | Required | Description                      |
|----------------|----------|----------|----------------------------------|
| depositDataRoot | `string` | **Yes**  | The vault validators merkle tree |
| userAddress    | `string` | **Yes**  | The user address                 |
| vaultAddress   | `string` | **Yes**  | The address of the vault         |

#### Example:

```ts
const params = {
  depositDataRoot: 'hash',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.setDepositDataRoot(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.setDepositDataRoot.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.setDepositDataRoot.estimateGas(params)
```
