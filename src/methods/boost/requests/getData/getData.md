---
id: getData
slug: /boost/requests/getdata
---

#### Description:

Get boost data for vault user

#### Arguments:

| Name         | Type     | Required | Description              |
|--------------|----------|----------|--------------------------|
| userAddress  | `string` | **Yes**  | The user address         | 
| vaultAddress | `string` | **Yes**  | The address of the vault | 

#### Returns:

```ts
type Output = {
  shares: bigint
  rewardAssets: bigint
  maxMintShares: bigint
  isProfitable: boolean
  exitingPercent: bigint
}
```

| Name             | Description                                                                                      |
|------------------|--------------------------------------------------------------------------------------------------|
| `shares`         | Tokens count of boost                                                                            |
| `isProfitable`   | Does the boost APY exceed the current APY of the vault, if yes, then the method will return true |
| `maxMintShares`  | Maximum possible number of osToken without deductions                                            |
| `exitingPercent` | The percent (in wad) of user's position that is currently exiting                                |
| `rewardAssets`   | User boost rewards                                                                               |

#### Example:

```ts
await sdk.boost.getData({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
