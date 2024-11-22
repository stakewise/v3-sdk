---
id: getPermitSignature
slug: /utils/getpermitsignature
---

#### Description:

Get permit signature for ERC20 token

#### Arguments:
| Name           | Type       | Required | Description                |
|----------------|------------|----------|----------------------------|
| contract       | `Erc20Abi` | **Yes**  | The ERC20 token contract   |
| ownerAddress   | `string`   | **Yes**  | The user address           |
| spenderAddress | `string`   | **Yes**  | The address of the spender |

#### Returns:

```ts
type Output = {
  amount: bigint
  deadline: number
  v: number
  r: string
  s: string
}
```

#### Example:

```ts
const permitParams = await sdk.utils.getPermitSignature({
  contract: sdk.contracts.tokens.mintToken,
  ownerAddress: '0x...',
  spenderAddress: '0x...',
})
```
