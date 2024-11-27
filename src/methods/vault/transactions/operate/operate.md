---
id: operate
slug: /vault/transactions/operate
---

#### Description:

Updates the vault by authorized personnel such as the vault admin, whitelistManager, blocklist manager, validators manager.

#### Arguments:

| Name                      | Type                                         | Required | Access               | Description                                                                                                                                                                 |  
|---------------------------|----------------------------------------------|----------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| whitelistManager          | `Array<{ address: string, isNew: boolean }>` | **No**   | whitelistManager     | List of addresses to update the whitelist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one. Max count at time - 700 addresses.             |  
| blocklist                 | `Array<{ address: string, isNew: boolean }>` | **No**   | Blocklist manager    | List of addresses to update the blocklist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one. Max count at time  - 700 addresses.            |
| validatorsManager         | `string`                                     | **No**   | Admin                | Address of the vault deposit data manager. Support only **second version** on valults.                                                                                      |   
| whitelistManager          | `string`                                     | **No**   | Admin                | Address of the vault whitelistManager                                                                                                                                       |  
| feeRecipient              | `string`                                     | **No**   | Admin                | Address of the vault fee recipient                                                                                                                                          |
| blocklistManager          | `string`                                     | **No**   | Admin                | The blocklisted vault blocklist manager                                                                                                                                     |  
| image                     | `string`                                     | **No**   | Admin                | The vault image in base64 string format (will be uploaded to IPFS; maximum size is 1 MB)                                                                                    |  
| displayName               | `string`                                     | **No**   | Admin                | The vault display name (will be uploaded to IPFS; maximum size is 30 characters)                                                                                            |  
| description               | `string`                                     | **No**   | Admin                | The vault description (will be uploaded to IPFS; maximum size is 1000 characters)                                                                                           |  
| userAddress               | `string`                                     | **Yes**  | -                    | The address of the user making the update (admin, whitelist manager, blocklist manager or keys manager)                                                                     |  
| vaultAddress              | `string`                                     | **Yes**  | -                    | The address of the vault                                                                                                                                                    |

#### Example:

```ts
// Data to update the vault by admin.
const params = {
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
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.operate.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.operate.estimateGas(params)
```
