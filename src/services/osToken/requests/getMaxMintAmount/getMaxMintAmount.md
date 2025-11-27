---
id: getMaxMintAmount
slug: /osToken/requests/getmaxmintamount
---

#### Description:

Maximum number of **shares** for minting

#### Arguments:
| Name             | Type     | Required | Description                                                  |
|------------------|----------|----------|--------------------------------------------------------------|
| userAddress      | `string` | **Yes**  | The user address                                             |
| vaultAddress     | `string` | **Yes**  | The address of the vault                                     |

#### Returns:

```ts
type Output = bigint
```
#### Example:

```ts
await sdk.osToken.getMaxMintAmount({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
