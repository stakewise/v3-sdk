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
  rewardAssets: bigint
  maxMintShares: bigint
  exitingPercent: number
  allocatorMaxBoostApy: number
  osTokenHolderMaxBoostApy: number
}
```

| Name             | Description                                                                                      |
|------------------|--------------------------------------------------------------------------------------------------|
| `shares`         | Tokens count of boost |
| `vaultApy`       | Base vault apy |
| `maxMintShares`  | Maximum possible number of osToken without deductions |
| `exitingPercent` | The percent (in wad) of user's position that is currently exiting |
| `rewardAssets`   | User boost rewards |
| `allocatorMaxBoostApy` | The average max boost APY earned in this vault by the allocator |
| `osTokenHolderMaxBoostApy` | The average max boost APY earned in this vault by the osToken holder |

#### Example:

```ts
await sdk.boost.getData({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
