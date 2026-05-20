---
id: getDistributorClaimedAmount
slug: /sdk/api/distributorRewards/requests/getdistributorclaimedamount
description: Use the StakeWise SDK distributorRewards getDistributorClaimedAmount method to fetch the cumulative amount of a distributor reward token already claimed by a user.
---

#### Description:

Returns the cumulative amount of a distributor reward token that has already been claimed by a user, looked up by the on-chain `distributorClaimedAmount` entity id.

#### Arguments:

| Name | Type     | Required | Description                                                                |
|------|----------|----------|----------------------------------------------------------------------------|
| id   | `string` | **Yes**  | The entity id, composed as `token-address-user address` (case-insensitive) |

#### Returns:

```ts
type Output = string | null
```

| Name     | Description                                                                                                                |
|----------|----------------------------------------------------------------------------------------------------------------------------|
| `Output` | The cumulative amount of the token claimed by the user. `null` when no `distributorClaimedAmount` entity exists for the id |

#### Example:

```ts
const cumulativeClaimedAmount = await sdk.distributorRewards.getDistributorClaimedAmount({
  id: '0xTokenAddress-0xUserAddress',
})
```
