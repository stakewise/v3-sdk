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
