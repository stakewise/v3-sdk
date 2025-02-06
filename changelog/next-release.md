# New
### 1. [sdk.osToken.getStats](https://sdk.stakewise.io/osToken/requests/getstats)

#### Description:

Getting the osToken stats collection. With the help of this data it is possible to build a chart.

#### Example:
```ts
await sdk.osToken.getStats({
  daysCount: 30
})
```

# Updates
### 1. [sdk.boost.getData](https://sdk.stakewise.io/boost/requests/getdata)

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
