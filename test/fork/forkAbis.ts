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
    'event Deposited(address indexed caller, address indexed receiver, uint256 assets, uint256 shares, address referrer)',
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
    'function claimer() view returns (address)',
    'function sharesOf(address account) view returns (uint256)',
  ],
  subVaultsRegistry: [
    'function getSubVaults() view returns (address[])',
    'function pendingMetaSubVault() view returns (address)',
  ],
  osTokenRedeemer: [
    'function processExitQueue()',
    'function queuedShares() view returns (uint128)',
    'function getExitQueueIndex(uint256 positionTicket) view returns (int256)',
    'function swapAssetsToOsTokenShares(address receiver) payable returns (uint256)',
    'function calculateExitedAssets(address, uint256, uint256) view returns (uint256, uint256, uint256 exitedAssets)',
    'event ExitQueueEntered(address indexed owner, address indexed receiver, uint256 positionTicket, uint256 shares)',
  ],
  rewardSplitterFactory: [
    'event RewardSplitterCreated(address owner, address vault, address rewardSplitter)',
  ],
  leverageStrategy: [
    'function isStrategyProxyExiting(address proxy) view returns (bool)',
    'event StrategyProxyUpgraded(address indexed vault, address indexed user, address strategy)',
    'event Deposited(address indexed vault, address indexed user, uint256 osTokenShares, uint256, address)',
    'function getBorrowState(address proxy) view returns (uint256 borrowedAssets, uint256 suppliedOsTokenShares)',
    'event ExitedAssetsClaimed(address indexed vault, address indexed user, uint256 osTokenShares, uint256 assets)',
  ],
  strategyProxy: [
    'function owner() view returns (address)',
  ],
  mintTokenController: [
    'function setAvgRewardPerSecond(uint256 avgRewardPerSecond)',
  ],
}


export default forkAbis
