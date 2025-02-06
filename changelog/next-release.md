# New
### 1. `sdk.osToken.getstats`

#### Description:

Getting the osToken stats collection. With the help of this data it is possible to build a chart.

#### Arguments:

| Name   | Type     | Required | Description              |
|--------|----------|----------|--------------------------|
| daysCount  | `number` | **Yes**  | The limit in days        |

#### Returns:

```ts
type Output = {
  apy: number
  time: number
  balance: number
  rewards: number
}
```
| Name | Description                                                       |
|------|-------------------------------------------------------------------|
| `time` | Date and time for each data point                                 |
| `apy` | Current APY based on time, rewards and balance.                   |
| `rewards` | Number of assets earned by the osToken during the interval in ETH |
| `balance` | Total assets in the osToken at the moment of time in ETH            |
#### Example:
```ts
await sdk.osToken.getStats({
  daysCount: 30
})
```

# Updates
### 1. `sdk.boost.getData`

#### New output fields:

```ts
type AddedOutput = {
  totalShares: bigint
  borrowStatus: BorrowStatus
  borrowedAssets: bigint
}
```

| Name             | Description                                                      |
|------------------|------------------------------------------------------------------|
| `totalShares`    | Tokens count of boost + reward assets converted to shares        |
| `borrowStatus`   | Aave borrow status. enum BorrowStatus (Healthy, Moderate, Risky) |
| `borrowedAssets` | Amount of borrowed ETH                                           |
