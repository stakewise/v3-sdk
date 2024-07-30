export enum Network {
  Mainnet = 1,
  Holesky = 17000,

  Gnosis = 100,
  Chiado = 10200,
}

export enum VaultType {
  Default = 'Default',
  Private = 'Private',
  Blocklist = 'Blocklist',
}

export enum AllocatorActionType {
  Redeemed = 'Redeemed',
  Migrated = 'Migrated',
  Deposited = 'Deposited',
  TransferIn = 'TransferIn',
  VaultCreated = 'VaultCreated',
  OsTokenMinted = 'OsTokenMinted',
  OsTokenBurned = 'OsTokenBurned',
  OsTokenRedeemed = 'OsTokenRedeemed',
  ExitQueueEntered = 'ExitQueueEntered',
  OsTokenLiquidated = 'OsTokenLiquidated',
  ExitedAssetsClaimed = 'ExitedAssetsClaimed',
}

export enum OsTokenPositionHealth {
  Unhealthy,
  Moderate,
  Healthy,
  Risky,
}
