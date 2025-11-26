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
type LeverageStrategyData = {
  version: number
  isUpgradeRequired: boolean
}

type Output = {
  shares: bigint
  vaultApy: number
  totalShares: bigint
  rewardAssets: bigint
  borrowStatus: BorrowStatus
  maxMintShares: bigint
  borrowedAssets: bigint
  exitingPercent: number
  allocatorMaxBoostApy: number
  leverageStrategyData: LeverageStrategyData
}
```

| Name                                     | Description                                                          |
|------------------------------------------|----------------------------------------------------------------------|
| `shares`                                 | Tokens count of boost                                                |
| `totalShares`                            | Tokens count of boost + reward assets converted to shares            |
| `vaultApy`                               | Base vault apy                                                       |
| `maxMintShares`                          | Maximum possible number of osToken without deductions                |
| `exitingPercent`                         | The percent (in wad) of user's position that is currently exiting    |
| `rewardAssets`                           | User boost rewards                                                   |
| `borrowStatus`                           | Aave borrow status. enum BorrowStatus (Healthy, Moderate, Risky)     |
| `borrowedAssets`                         | Amount of borrowed ETH                                               |
| `allocatorMaxBoostApy`                   | The average max boost APY earned in this vault by the allocator      |
| `leverageStrategyData.version`           | The version of the leverage strategy contract                        |
| `leverageStrategyData.isUpgradeRequired` | The upgrade status of the leverage strategy contract                 |

#### Example:

```ts
await sdk.boost.getData({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
