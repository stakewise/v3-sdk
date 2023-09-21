export enum Network {
  Gnosis = 100,
  Mainnet = 1,
  Goerli = 5,
}

export enum AllocatorActionType {
  Redeemed = 'Redeemed',
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
