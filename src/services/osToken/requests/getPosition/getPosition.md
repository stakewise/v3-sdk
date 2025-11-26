---
id: getPosition
title: getPosition
slug: /osToken/requests/getposition
---

# Deprecated!
Use getBalance

#### Description:

User position data

#### Arguments:
| Name             | Type     | Required | Description                                                  |
|------------------|----------|----------|--------------------------------------------------------------|
| liqThresholdPercent | `bigint` | **Yes**  | [sdk.vault.getVault](/vault/requests/getvault)               |
| stakedAssets     | `bigint` | **Yes**  | [sdk.vault.getStakeBalance](/vault/requests/getstakebalance) |
| userAddress      | `string` | **Yes**  | The user address                                             |
| vaultAddress     | `string` | **Yes**  | The address of the vault                                     |

#### Returns:

```ts
type Output = {
  minted: {
    assets: bigint
    shares: bigint
  }
  healthFactor: {
    value: number
    health: OsTokenPositionHealth
  }
  protocolFeePercent: bigint
}
```

| Name                 | Description                                                     |
|----------------------|-----------------------------------------------------------------|
| `minted.shares`      | Balance                                                         |
| `minted.assets`      | Balance in ETH                                                  |
| `healthFactor`       | [sdk.osToken.getHealthFactor](/osToken/helpers/gethealthfactor) |
| `protocolFeePercent` | Usage fee percent                                               |

#### Example:

```ts
await sdk.osToken.getPosition({
  stakedAssets: 0n,
  userAddress: '0x...',
  vaultAddress: '0x...',
  liqThresholdPercent:  0n,
})
```
