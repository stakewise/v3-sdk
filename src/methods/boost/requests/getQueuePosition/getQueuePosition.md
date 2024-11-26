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
  totalShares: bigint
  totalAssets: bigint
  isClaimable: boolean
  duration: number | null
  position: ClaimPosition | null
}
```

| Name             | Description                                          |
|------------------|------------------------------------------------------|
| `totalShares`    | Unlock osToken count |
| `totalAssets`    | Unlock rewards count |
| `isClaimable`    | Available for claim or not |
| `duration`       | Approximate time of position in the queue |
| `position`       | The data that will be needed for the claim operation |

#### Example:

```ts
await sdk.boost.getQueuePosition({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
