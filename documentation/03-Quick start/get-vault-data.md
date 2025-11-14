---
id: get-vault-data
title: Get vault data
sidebar_position: 0
---

# Get vault data

After creating a Vault, the first step is to retrieve its core data. In this example, we fetch the Vault's primary information. Note that `getWhitelist` and `getBlocklist` methods are specific to certain Vault types.

```ts
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'


const sdk = const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
})

const getVaultData = async (vaultAddress: string) => {
  try {
    const [
      mainData,
      statsChart,
      validatorsList,
      whitelist,
      blocklist,
     ] = await Promise.all([
      sdk.vault.getVault({ vaultAddress }),
      sdk.vault.getVaultStats({ vaultAddress, daysCount: 30 }),
      sdk.vault.getValidators({ vaultAddress, skip: 0, limit: 20 }),
      sdk.vault.getWhitelist({ vaultAddress }), // For private vaults
      sdk.vault.getBlocklist({ vaultAddress }), // For blocklist vaults
    ])

    console.log('Result:', {
      mainData,
      whitelist,
      blocklist,
      statsChart,
      validatorsList,
    })
  }
  catch (error) {
    console.error(error)
  }
}

getVaultData('YOUR_VAULT_ADDRESS')
```
---
