---
id: create
slug: /sdk/api/vault/transactions/create
description: Use the StakeWise SDK createVault method to deploy a new staking vault with custom configuration, fees, and metadata.
---

#### Description:

Create a StakeWise V3 vault. The optional `vaultToken: { name, symbol }` argument toggles between an **ERC20 vault** (vault mints a transferable share token) and a **non-ERC20 vault** (shares tracked internally). The `type` argument selects `Default`, `Private`, or `Blocklist` access. The two combine into six factories; the SDK picks the right one automatically.

When the transaction is executed, one gwei of the deposit token must be stored in the vault to avoid [inflation attack](https://blog.openzeppelin.com/a-novel-defense-against-erc4626-inflation-attacks).
On Mainnet and Hoodi the deposit token is the native asset (ETH) and the SDK attaches the 1 gwei automatically.
On Gnosis the deposit token is GNO, so before calling `sdk.vault.create` you must call `approve` on GNO to allow the vault factory to spend 1 gwei. Retrieve the factory address with `sdk.vault.getVaultFactory({ vaultType: params.type, isErc20: Boolean(params.vaultToken) })`.

**Important**: When creating a metavault on Gnosis, only the default vault type is supported. ERC20 tokens and private vaults are not available. Additionally, all metavaults do not support the `isOwnMevEscrow` parameter.



#### Arguments:

| Name           | Type                               | Required | Description                                                                                                                                                |
|----------------|------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| userAddress    | `string`                           | **Yes**  | The address of the user initiating the action. This address will become the vault admin |
| type           | `VaultType`                        | **No**   | One of: `Default`, `Private`, `Blocklist`, `MetaVault`, `PrivateMetaVault`. Imported from the library: `import { VaultType } from '@stakewise/v3-sdk'`. Use `MetaVault` / `PrivateMetaVault` to deploy a meta vault that holds a registry of sub-vaults; `PrivateMetaVault` is Mainnet/Hoodi only. |
| vaultToken     | `{ name: string, symbol: string }` | **No**   | If provided, the vault will be created with its own ERC20 token |
| capacity       | `bigint`                           | **No**   | If provided, should be defined in gwei. By default, capacity is `MaxUint256`; the minimum allowed capacity is `parseEther('32')`|
| keysManagerFee | `number`                           | **No**   | If provided, should be between `0` and `100`, inclusive with a maximum of two decimal digits allowed (e.g., `15.35`). By default, the fee is `0`|
| isOwnMevEscrow | `boolean`                          | **No**   | Defines whether to send block rewards to the Smoothing Pool (`false`) or keep them only to your Vault (`true`). By default, this value is `false`. **Note**: This parameter is not supported for metavaults|
| image          | `string`                           | **No**   | The vault image in base64 string format (will be uploaded to IPFS; maximum size is 1 MB)|  
| displayName    | `string`                           | **No**   | The vault display name (will be uploaded to IPFS; maximum size is 30 characters)|  
| description    | `string`                           | **No**   | The vault description (will be uploaded to IPFS; maximum size is 1000 characters)|  

#### Example: ERC20 vault on Mainnet

```ts
import { MaxUint256 } from 'ethers'
import { VaultType } from '@stakewise/v3-sdk'

const params = {
  userAddress: '0x...',
  type: VaultType.Default,
  vaultToken: {
    name: 'Vault Token',
    symbol: 'vlt',
  },
  capacity: MaxUint256,
  keysManagerFee: 0,
  isOwnMevEscrow: false,
  image: 'data:image/png;base64,...',
  displayName: 'Example vault',
  description: 'Example description',
}

// Send transaction
const hash = await sdk.vault.create(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.vault.create.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.create.estimateGas(params)
```

#### Example: non-ERC20 Private vault

Omit `vaultToken` to deploy a non-ERC20 vault and switch `type` to restrict access:

```ts
import { VaultType } from '@stakewise/v3-sdk'

const hash = await sdk.vault.create({
  userAddress: '0x...',
  type: VaultType.Private,
  isOwnMevEscrow: false,
  keysManagerFee: 5,
  displayName: 'Private vault',
})

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })
```

#### Example: ERC20 vault on Gnosis (with GNO approve)

On Gnosis the 1 gwei security deposit is GNO, not native xDAI. Approve the vault factory before `sdk.vault.create`:

```ts
import { MaxUint256 } from 'ethers'
import { VaultType } from '@stakewise/v3-sdk'

const userAddress = '0x...'
const isErc20 = true

const factoryAddress = await sdk.vault.getVaultFactory({
  vaultType: VaultType.Default,
  isErc20,
})

const depositTokenAddress = sdk.config.addresses.tokens.depositToken
const gno = sdk.contracts.helpers.createErc20(depositTokenAddress)
const signer = await sdk.provider.getSigner(userAddress)

const approveTx = await gno.connect(signer).approve(factoryAddress, MaxUint256)
await approveTx.wait()

const hash = await sdk.vault.create({
  userAddress,
  type: VaultType.Default,
  vaultToken: { name: 'Gnosis Vault Share', symbol: 'GVS' },
  isOwnMevEscrow: false,
  keysManagerFee: 5,
  displayName: 'Gnosis ERC20 vault',
})

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })
```

#### Example: meta vault on Gnosis

On Gnosis a meta vault uses `VaultType.MetaVault` (open) - `PrivateMetaVault` is not supported. Meta vaults do not accept `vaultToken` (no ERC20 share token on Gnosis meta vaults) and never accept `isOwnMevEscrow`. The sub-vaults underneath the meta vault keep their own MEV configuration.

```ts
import { MaxUint256 } from 'ethers'
import { VaultType } from '@stakewise/v3-sdk'

const userAddress = '0x...'

const factoryAddress = await sdk.vault.getVaultFactory({
  vaultType: VaultType.MetaVault,
  isErc20: false,
})

const depositTokenAddress = sdk.config.addresses.tokens.depositToken
const gno = sdk.contracts.helpers.createErc20(depositTokenAddress)
const signer = await sdk.provider.getSigner(userAddress)

const approveTx = await gno.connect(signer).approve(factoryAddress, MaxUint256)
await approveTx.wait()

const hash = await sdk.vault.create({
  userAddress,
  type: VaultType.MetaVault,
  keysManagerFee: 5,
  displayName: 'Gnosis Meta Vault',
})

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })
```

After deploying the meta vault, the curator (the `userAddress` above) populates its registry by calling `sdk.vault.addSubVault({ vaultAddress: metaVaultAddress, subVaultAddress, userAddress })` for each sub-vault.

#### Example: private meta vault on Mainnet

On Mainnet and Hoodi, `VaultType.PrivateMetaVault` is supported. Mainnet does not require an approve step (the 1 gwei security deposit is native ETH and the SDK attaches it automatically):

```ts
import { VaultType } from '@stakewise/v3-sdk'

const hash = await sdk.vault.create({
  userAddress: '0x...',
  type: VaultType.PrivateMetaVault,
  keysManagerFee: 5,
  displayName: 'Private Meta Vault',
})

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })
```
