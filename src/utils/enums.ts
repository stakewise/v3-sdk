export enum Network {
  Gnosis = 100,
  Mainnet = 1,
  Goerli = 5,
  Holesky = 17000,
}

export enum AllocatorActionType {
  Redeemed = 'Redeemed',
  Migrated = 'Migrated',
  Deposited = 'Deposited',
  VaultCreated = 'VaultCreated',
  ExitedAssetsClaimed = 'ExitedAssetsClaimed',
}

export enum OsTokenPositionHealth {
  Unhealthy,
  Moderate,
  Healthy,
  Risky,
}
