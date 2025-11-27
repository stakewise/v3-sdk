---
id: getQueuePosition
slug: /boost/requests/getqueueposition
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
  totalShares: bigint
  isClaimable: boolean
  exitingShares: bigint
  exitingAssets: bigint
  duration: number | null
  position: ClaimPosition | null
}
```

| Name          | Description                                          |
|---------------|------------------------------------------------------|
| exitingShares | The exiting amount of user exiting osToken shares    |
| exitingAssets | The total amount of user exiting assets              |
| isClaimable   | Available for claim or not                           |
| duration      | Approximate time of position in the queue            |
| position      | The data that will be needed for the claim operation |
| version       | The leverage strategy version                        |

#### Example:

```ts
await sdk.boost.getQueuePosition({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
