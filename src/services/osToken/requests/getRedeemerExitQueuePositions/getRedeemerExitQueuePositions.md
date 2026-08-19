---
id: getRedeemerExitQueuePositions
slug: /sdk/api/osToken/requests/getredeemerexitqueuepositions
description: Use the StakeWise SDK getRedeemerExitQueuePositions method to retrieve a user's OsTokenRedeemer exit queue positions and claimable amounts.
---

#### Description:

Returns the OsTokenRedeemer exit queue positions for a specific user.

#### Arguments:

| Name        | Type      | Required | Description                             |
|-------------|-----------|----------|-----------------------------------------|
| userAddress | `string`  | **Yes**  | The user address                        |
| isClaimed   | `boolean` | **No**   | Whether the exit request is claimed     |

#### Returns:

```ts
type ExitRequest = {
  owner: string
  receiver: string
  isClaimed: boolean
  timestamp: string
  isClaimable: boolean
  totalShares: bigint
  totalAssets: bigint
  exitedAssets: bigint
  positionTicket: string
  exitQueueIndex: string | null
}

type Position = {
  positionTicket: string
  exitQueueIndex: string
}

type Output = {
  total: bigint
  withdrawable: bigint
  positions: Position[]
  requests: ExitRequest[]
}
```

| Name           | Description                                                   |
|----------------|--------------------------------------------------------------|
| `requests`     | Array of all requests                                        |
| `positions`    | Positions in a special format that are required for claiming |
| `total`        | Total queued assets (e.g. ETH)                               |
| `withdrawable` | Assets available for withdrawal (e.g. ETH)                   |

#### Example:

```ts
await sdk.osToken.getRedeemerExitQueuePositions({
  userAddress: '0x...',
})
```
