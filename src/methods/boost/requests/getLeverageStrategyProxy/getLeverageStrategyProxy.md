---
id: getLeverageStrategyProxy
slug: /boost/requests/getleveragestrategyproxy
---

#### Description:

Get the address of the leverage strategy proxy contract

#### Arguments:
| Name         | Type     | Required | Description              |
|--------------|----------|----------|--------------------------|
| userAddress  | `string` | **Yes**  | The user address         |
| vaultAddress | `string` | **Yes**  | The address of the vault |

#### Returns:

```ts
type Output = string
```

#### Example:

```ts
const strategyProxy = await sdk.boost.getLeverageStrategyProxy({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
