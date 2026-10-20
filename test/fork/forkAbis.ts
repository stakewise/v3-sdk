const forkAbis = {
  vault: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function capacity() view returns (uint256)',
    'function mevEscrow() view returns (address)',
    'function feePercent() view returns (uint16)',
    'function feeRecipient() view returns (address)',
    'function validatorsRoot() view returns (bytes32)',
    'function subVaultsRegistry() view returns (address)',
    'function validatorsManager() view returns (address)',
    'function blockedAccounts(address account) view returns (bool)',
    'function whitelistedAccounts(address account) view returns (bool)',
    'event MetadataUpdated(address indexed caller, string metadataIpfsHash)',
    'event Deposited(address indexed caller, address indexed receiver, uint256 assets, uint256 shares, address)',
    'event ExitQueueEntered(address indexed owner, address indexed receiver, uint256 positionTicket, uint256 shares)',
  ],
  vaultFactory: [
    'event VaultCreated(address indexed admin, address indexed vault, address ownMevEscrow, bytes params)',
    'event MetaVaultCreated(address indexed caller, address indexed admin, address indexed vault, bytes params)',
  ],
  depositDataRegistry: [
    'function depositDataRoots(address vault) view returns (bytes32)',
  ],
  rewardSplitter: [
    'function vault() view returns (address)',
    'function sharesOf(address account) view returns (uint256)',
  ],
  rewardSplitterFactory: [
    'event RewardSplitterCreated(address owner, address vault, address rewardSplitter)',
  ],
}


export default forkAbis
