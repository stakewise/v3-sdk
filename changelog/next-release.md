# New
---

# Updates
### 1. [sdk.rewardSplitter.getClaimAmount](https://sdk.stakewise.io/rewardSplitter/requests/getclaimamount)

#### New output:

```ts
type Item = {
  assets: bigint
  address: string
}

type Output = {
  active: Item
  inactive: Array<Item>
}
```

| Name             | Description                                                      |
|------------------|------------------------------------------------------------------|
| `active`   | Rewards amount from active fee splitter |
| `inactive` | Aave borrow status. enum BorrowStatus (Healthy, Moderate, Risky) |
