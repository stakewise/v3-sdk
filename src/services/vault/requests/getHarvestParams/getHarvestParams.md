---
id: getHarvestParams
slug: /sdk/api/vault/requests/getharvestparams
description: Use the StakeWise SDK getHarvestParams method to fetch the parameters needed to update vault state and harvest rewards.
---

#### Description:

Necessary to update the vault state

#### Returns:

```ts
type Output = {
  canHarvest: boolean
  params: {
    reward: string
    proof: Array<string>
    rewardsRoot: string
    unlockedMevReward: string 
  }
}
```

| Name | Description |
|------|------------|
| `canHarvest` | Defines whether the vault can harvest new rewards |
| `reward` | The vault reward used to submit state update proof |
| `proof` | The vault rewards root proof used to submit state update proof |
| `rewardsRoot` | The vault rewards root |
| `unlockedMevReward` | The vault unlocked MEV reward used to submit state update proof |

#### Example:

```ts
await sdk.vault.getHarvestParams({ vaultAddress: '0x...' })
```
