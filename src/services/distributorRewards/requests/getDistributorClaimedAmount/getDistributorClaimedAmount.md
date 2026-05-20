---
id: getDistributorClaimedAmount
slug: /sdk/api/distributorRewards/requests/getdistributorclaimedamount
description: Use the StakeWise SDK distributorRewards getDistributorClaimedAmount method to fetch the total amount of a token claimed by a user from the merkle distributor.
---

# getDistributorClaimedAmount

## Description

Returns the total amount of a token claimed by a user from the merkle distributor.

## Arguments

| Name | Type     | Required | Description                                                                |
|------|----------|----------|----------------------------------------------------------------------------|
| id   | `string` | **Yes**  | The id of the record. Composed as `token-address-user-address` (lowercase) |

## Returns

```ts
type Output = string | null
```

The cumulative claimed amount for the given id, or `null` if no record exists.

## Example

```ts
const cumulativeClaimedAmount = await sdk.distributorRewards.getDistributorClaimedAmount({
  id: '0xTokenAddress-0xUserAddress',
})
```
