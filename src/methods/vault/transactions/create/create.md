---
id: create
slug: /vault/transactions/create
---

#### Description:

Create a vault. When the transaction is executed, one gwei of the deposit token must be stored in the vault to avoid [inflation attack](https://blog.openzeppelin.com/a-novel-defense-against-erc4626-inflation-attacks).
Pay attention to chains where the deposit token is not a native token (such as Gnosis or Chiado).
On these chains before creating the vault, ensure that you call the `approve` function on the deposit token contract,
allowing the vault factory address to spend one gwei.
You can retrieve the vault factory contract using the helper function: `sdk.getVaultFactory({ vaultType: params.type, isErc20: params.isErc20 })`.

#### Arguments:

| Name           | Type                               | Required | Description                                                                                                                                                |
|----------------|------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| userAddress    | `string`                           | **Yes**  | The address of the user initiating the action. This address will become the vault admin                                                                    |
| type           | `VaultType`                        | **No**   | Allowed vault types: Default, Private and Blocklist. Available vault types can be found in the `enum VaultType` which you can be imported from the library |
| vaultToken     | `{ name: string, symbol: string }` | **No**   | If provided, the vault will be created with its own ERC20 token                                                                                            |
| capacity       | `bigint`                           | **No**   | If provided, should be defined in gwei. By default, capacity is `MaxUint256`; the minimum allowed capacity is `parseEther('32')`                           |
| keysManagerFee | `number`                           | **No**   | If provided, should be between `0` and `100`, inclusive with a maximum of two decimal digits allowed (e.g., `15.35`). By default, the fee is `0`           |
| isOwnMevEscrow | `boolean`                          | **No**   | Defines whether to send block rewards to the Smoothing Pool (`false`) or keep them only to your Vault (`true`). By default, this value is `false`          |
| image          | `string`                           | **No**   | The vault image in base64 string format (will be uploaded to IPFS; maximum size is 1 MB)                                                                   |  
| displayName    | `string`                           | **No**   | The vault display name (will be uploaded to IPFS; maximum size is 30 characters)                                                                           |  
| description    | `string`                           | **No**   | The vault description (will be uploaded to IPFS; maximum size is 1000 characters)                                                                          |  

#### Example:

```ts
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

// Transaction example
// Send transaction to create a vault
const hash = await sdk.vault.create(params)
// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.vault.deposit.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.deposit.estimateGas(params)
```
