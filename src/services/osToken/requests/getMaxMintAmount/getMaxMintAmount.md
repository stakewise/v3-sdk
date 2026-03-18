---
id: getMaxMintAmount
slug: /sdk/api/osToken/requests/getmaxmintamount
description: Use the StakeWise SDK getMaxMintAmount method to calculate the maximum number of osToken shares a user can mint.
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
