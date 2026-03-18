---
id: getVaultFactory
slug: sdk/api/vault/requests/getvaultfactory
description: Use the StakeWise SDK getVaultFactory method to get the vault factory contract address needed for vault creation.
---

#### Description:

Getting the vault factory for vault creation.

#### Arguments:

| Name   | Type     | Required | Description                    |
|--------|----------|----------|--------------------------------|
| isErc20 | `boolean` | **No**  | factory with ERC20 token |
| vaultType | `VaultType` | **Yes**  | Type of vault |

#### Returns:

```ts
type Output = VaultFactory
```

#### Example:

```ts
import { VaultType } from '@stakewise/v3-sdk'

await sdk.vault.getVaultFactory({
  vaultType: VaultType.Default,
  isErc20: true,
})
```
