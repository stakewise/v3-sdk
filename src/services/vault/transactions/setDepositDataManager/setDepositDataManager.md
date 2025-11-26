---
id: setDepositDataManager
slug: /vault/transactions/setdepositdatamanager
---

#### Description:

Adding deposit data manager to vaults **version 2** or higher

#### Arguments:

| Name           | Type     | Required | Description               |
|----------------|----------|----------|---------------------------|
| managerAddress | `string` | **Yes**  | New deposit-data manager  |
| userAddress    | `string` | **Yes**  | The user address          |
| vaultAddress   | `string` | **Yes**  | The address of the vault  |

#### Example:

```ts
const params = {
  managerAddress: '0x...',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.setDepositDataManager(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.setDepositDataManager.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.setDepositDataManager.estimateGas(params)
```
