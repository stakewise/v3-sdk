---
id: getPosition
title: getPosition
slug: sdk/api/osToken/requests/getposition
description: "StakeWise SDK getPosition method (deprecated): retrieves user osToken position data including minted assets and health factor."
---

# Deprecated!
Use getBalance

#### Description:

User position data

#### Arguments:
| Name             | Type     | Required | Description                                                  |
|------------------|----------|----------|--------------------------------------------------------------|
| liqThresholdPercent | `bigint` | **Yes**  | [sdk.vault.getVault](/sdk/api/vault/requests/getvault)               |
| stakedAssets     | `bigint` | **Yes**  | [sdk.vault.getStakeBalance](/sdk/api/vault/requests/getstakebalance) |
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
| `healthFactor`       | [sdk.osToken.getHealthFactor](/sdk/api/osToken/helpers/gethealthfactor) |
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
