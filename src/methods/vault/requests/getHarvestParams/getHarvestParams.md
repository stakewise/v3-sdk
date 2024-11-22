---
id: getHarvestParams
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

#### Example:

```ts
await sdk.vault.getHarvestParams({ vaultAddress: '0x...' })
```
