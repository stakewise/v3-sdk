---
id: getLeverageStrategyData
slug: /boost/requests/getleveragestrategydata
---

#### Description:

Get the leverage strategy `version` and status `isUpgradeRequired`.

#### Arguments:
| Name         | Type     | Required | Description              |
|--------------|----------|----------|--------------------------|
| userAddress  | `string` | **Yes**  | The user address         |
| vaultAddress | `string` | **Yes**  | The address of the vault |

#### Returns:

```ts
type Output = { 
  version: number
  isUpgradeRequired: boolean
}
```

#### Example:

```ts
const leverageStrategyVersion = await sdk.boost.getLeverageStrategyVersion({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
