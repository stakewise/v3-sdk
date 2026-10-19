---
id: getQueuePosition
slug: /sdk/api/boost/requests/getqueueposition
description: Use the StakeWise SDK boost getQueuePosition method to retrieve unlock queue position data for a user's boosted osTokens.
---

#### Description:

Get unlock position data

#### Arguments:

| Name         | Type     | Required | Description              |
|--------------|----------|----------|--------------------------|
| userAddress  | `string` | **Yes**  | The user address         | 
| vaultAddress | `string` | **Yes**  | The address of the vault | 

#### Returns:

```ts
type ClaimPosition = {
  timestamp: string
  positionTicket: string
  exitQueueIndex: string
}

type Output = {
  version: number
  isClaimable: boolean
  exitingShares: bigint
  exitingAssets: bigint
  duration: number | null
  position: ClaimPosition | null
}
```

| Name          | Description                                                                                           |
|---------------|-------------------------------------------------------------------------------------------------------|
| exitingShares | The exiting amount of user exiting osToken shares                                                     |
| exitingAssets | The total amount of user exiting assets                                                               |
| isClaimable   | Available for claim or not                                                                            |
| duration      | Approximate unix time (seconds) when the position can be claimed, `null` while it is being calculated |
| position      | The data that will be needed for the claim operation                                                  |
| version       | The leverage strategy version                                                                         |

#### Example:

```ts
await sdk.boost.getQueuePosition({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
