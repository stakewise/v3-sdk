const forkAbis = {
  vault: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function capacity() view returns (uint256)',
    'function feePercent() view returns (uint16)',
    'function subVaultsRegistry() view returns (address)',
  ],
  vaultFactory: [
    'event VaultCreated(address indexed admin, address indexed vault, address ownMevEscrow, bytes params)',
    'event MetaVaultCreated(address indexed caller, address indexed admin, address indexed vault, bytes params)',
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
