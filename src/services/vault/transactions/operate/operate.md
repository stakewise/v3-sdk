---
id: operate
slug: /sdk/api/vault/transactions/operate
description: Use the StakeWise SDK operate method to update vault settings such as whitelist, blocklist, validators manager, and metadata.
---

#### Description:

Updates the vault by authorized personnel such as the vault admin, whitelistManager, blocklist manager, validators manager.

#### Constraints

- **One access mode per call.** The vault is either Private (whitelist) or Blocklist, never both. Passing `whitelist` / `whitelistManager` together with `blocklist` / `blocklistManager` in the same call throws an error before sending the transaction. Update one mode at a time.
- **700-address chunk limit.** `whitelist` and `blocklist` arrays are capped at 700 entries per call. Larger lists must be split across multiple sequential transactions; the SDK throws before sending if the limit is exceeded.
- **No vault-type pre-check.** The SDK does not verify that the target vault matches the access mode you are updating. Calling `whitelist` updates on a Default vault reverts at execution. Pre-check the vault type with `sdk.vault.getVault({ vaultAddress })` (`isPrivate`, `isBlocklist`) before calling `operate`.

#### Arguments:

| Name                      | Type                                         | Required | Access               | Description                |  
|---------------------------|----------------------------------------------|----------|----------------------|----------------------------|  
| whitelistManager          | `Array<{ address: string, isNew: boolean }>` | **No**   | whitelistManager     | List of addresses to update the whitelist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one. Max count at time - 700 addresses. |  
| blocklist                 | `Array<{ address: string, isNew: boolean }>` | **No**   | Blocklist manager    | List of addresses to update the blocklist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one. Max count at time  - 700 addresses. |
| validatorsManager         | `string`                                     | **No**   | Admin                | Address of the vault deposit data manager. Support only **second version** on valults. |   
| whitelistManager          | `string`                                     | **No**   | Admin                | Address of the vault whitelistManager |  
| feeRecipient              | `string`                                     | **No**   | Admin                | Address of the vault fee recipient |
| blocklistManager          | `string`                                     | **No**   | Admin                | The blocklisted vault blocklist manager |  
| image                     | `string`                                     | **No**   | Admin                | The vault image in base64 string format (will be uploaded to IPFS; maximum size is 1 MB) |  
| displayName               | `string`                                     | **No**   | Admin                | The vault display name (will be uploaded to IPFS; maximum size is 30 characters) |  
| description               | `string`                                     | **No**   | Admin                | The vault description (will be uploaded to IPFS; maximum size is 1000 characters) |  
| userAddress               | `string`                                     | **Yes**  | -                    | The address of the user making the update (admin, whitelist manager, blocklist manager or keys manager) |  
| vaultAddress              | `string`                                     | **Yes**  | -                    | The address of the vault |
| admin                     | `string`                                     | **No**   | -                    | Changing the vault administrator |
| feePercent                | `number`                                     | **No**   | Admin                | Changing fee percent charged by the vault |
#### Example:

```ts
// Data to update the vault by admin.
const params = {
  admin: '0x...',
  feePercent: '600',
  userAddress: '0x...',
  vaultAddress: '0x...',
  image: '...',
  displayName: '...',
  description: '...',
  feeRecipient: '0x...',
  blocklistManager: '0x...',
  whitelistManager: '0x...',
  validatorsManager: '0x...',
}

// Data to update the vault by vault keys manager.
const keysManagerParams = {
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Data to update the private vault by whitelist manager.
// The whitelist contains addresses allowed to stake or mint within
// the vault.
const whitelistParams = {
  whitelist: [
    {
      address: '0x...',
      isNew: true,
    },
    {
      address: '0x...',
      isNew: false,
    },
  ],
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Data to update blocklisted vault by blocklist manager. 
// The blocklist contains addresses disallowed to stake or mint within
// the vault.
const blocklistParams = {
  blocklist: [
    {
      address: '0x...',
      isNew: true,
    },
    {
      address: '0x...',
      isNew: false,
    },
  ],
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.operate(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.operate.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.operate.estimateGas(params)
```
