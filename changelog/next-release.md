# New
### 1. Get distributor rewards and claim:
- [sdk.distributorRewards.getRewards](/distributorRewards/requests/getrewards)
- [sdk.distributorRewards.claim](/distributorRewards/transactions/claim)

# Updates
### 2. [sdk.rewardSplitter.getClaimAmount](https://sdk.stakewise.io/rewardSplitter/requests/getclaimamount)

```
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


### 2. [sdk.rewardSplitter.setClaimer](https://sdk.stakewise.io/rewardSplitter/transactions/setclaimer)

#### Input
| Name                  | Type     | Required | Description                                                                                                                          |
|-----------------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| vaultAddress          | `string` | **Yes**  | The address of the vault                                                                                                             |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter                                                                                                   |
| claimerAddress        | `string` | **Yes**  | The address of the claimer                                                                                                           |


#### New input:

### 3. [sdk.vault.operate](https://sdk.stakewise.io/vault/transactions/operate)

#### Add new input field:

```ts
type Input = {
  admin: string
  feePercent: number
}

```
| Name           | Description                                                  |
|----------------|--------------------------------------------------------------|
| `admin`        | Changing the vault administrator                             |
| `feePercent`   | Changing fee percent charged by the vault                    |
