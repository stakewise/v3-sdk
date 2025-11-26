---
id: getExitQueuePositions
slug: /vault/requests/getexitqueuepositions
---

#### Description:

Returns the withdrawal queue for a specific user.

#### Arguments:

| Name         | Type      | Required | Description                           |
|--------------|-----------|----------|---------------------------------------|
| userAddress  | `string`  | **Yes**  | The user address                      |
| vaultAddress | `string`  | **Yes**  | The address of the vault              |
| isClaimed    | `boolean` | **No**   | Whether the user has claimed rewards  |

#### Returns:

```ts
type ExitRequest = {
  withdrawalTimestamp: string | null
  exitQueueIndex: string | null
  positionTicket: string
  isV2Position: boolean
  isClaimable: boolean
  exitedAssets: bigint
  totalAssets: bigint
  isClaimed: boolean
  timestamp: string
  receiver: string
}

type Position = {
  exitQueueIndex: string
  positionTicket: string
  timestamp: string
}

type Output = {
  total: bigint
  duration: number | null
  withdrawable: bigint
  positions: Position[]
  requests: ExitRequest[]
}
```

| Name           | Description                  |
|----------------|------------------------------|
| `requests`     | Array of all requests |
| `positions`    | Positions in a special format that are required for claiming |
| `total`        | Total queued assets (e.g. ETH) |
| `duration`     | Queue duration time (in seconds). <br/>- It represents the approximate time after which the assets can be collected (in seconds).<br/>- If the value is null, the time is still being calculated. <br/>- If the value is 0, the assets are available and can be collected. | 
| `withdrawable` | Assets available for withdrawal (e.g. ETH) |

#### Example:

```ts
await sdk.vault.getExitQueuePositions({
  vaultAddress: '0x...',
  userAddress: '0x...',
})
```
