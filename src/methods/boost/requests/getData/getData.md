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
  vaultApy: number
  totalShares: bigint
  rewardAssets: bigint
  borrowStatus: BorrowStatus
  maxMintShares: bigint
  borrowedAssets: bigint
  exitingPercent: number
  allocatorMaxBoostApy: number
  osTokenHolderMaxBoostApy: number
}
```

| Name                       | Description                                                          |
|----------------------------|----------------------------------------------------------------------|
| `shares`                   | Tokens count of boost                                                |
| `totalShares`              | Tokens count of boost + reward assets converted to shares            |
| `vaultApy`                 | Base vault apy                                                       |
| `maxMintShares`            | Maximum possible number of osToken without deductions                |
| `exitingPercent`           | The percent (in wad) of user's position that is currently exiting    |
| `rewardAssets`             | User boost rewards                                                   |
| `borrowStatus`             | Aave borrow status. enum BorrowStatus (Healthy, Moderate, Risky)     |
| `borrowedAssets`           | Amount of borrowed ETH                                               |
| `allocatorMaxBoostApy`     | The average max boost APY earned in this vault by the allocator      |
| `osTokenHolderMaxBoostApy` | The average max boost APY earned in this vault by the osToken holder |

#### Example:

```ts
await sdk.boost.getData({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
