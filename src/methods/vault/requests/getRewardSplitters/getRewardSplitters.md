---
id: getRewardSplitters
slug: /vault/requests/getrewardsplitters
---

#### Description:

Fetch the list of created reward splitters. A reward splitter is a contract designed to distribute vault rewards among multiple fee recipients in predefined proportions.
To use a reward splitter, its address should be added to the vault as a fee recipient.

#### Arguments:

| Name | Type     | Type    | Description                      |
|------|----------|---------|----------------------------------|
| vaultAddress | `string` | **Yes** | The address of the vault         |
| id | `string` | **No** | Reward splitter address          |
| owner | `string` | **No** | The owner of the reward splitter |

#### Returns:

```ts
type FeeRecipient = {
  shares: bigint
  percent: number
  address: string
}

type RewardSplitter = {
  owner: string
  address: string
  totalShares: bigint
  feeRecipients: FeeRecipient[]
}

type Output = {
  rewardSplitters: RewardSplitter[]
}
```

| Name              | Description |
|-------------------|-------------|
| `rewardSplitters` | An array of objects representing the result of the query based on your parameters |

#### Example:

```ts
await sdk.vault.getRewardSplitters({
  owner: '0x...', // OR id: '0x...'
  vaultAddress: '0x...',
})
```
