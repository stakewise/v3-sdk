export enum Network {
  Mainnet = 1,
  Gnosis = 100,

  /**
   * Network for mainnet testing
   */
  Hoodi = 560048,
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
  BoostDeposited = 'BoostDeposited',
  OsTokenRedeemed = 'OsTokenRedeemed',
  ExitQueueEntered = 'ExitQueueEntered',
  OsTokenLiquidated = 'OsTokenLiquidated',
  ExitedAssetsClaimed = 'ExitedAssetsClaimed',
  BoostExitedAssetsClaimed = 'BoostExitedAssetsClaimed',
}

export enum OsTokenPositionHealth {
  Unhealthy,
  Moderate,
  Healthy,
  Risky,
}

export enum BorrowStatus {
  Healthy,
  Moderate,
  Risky,
}
