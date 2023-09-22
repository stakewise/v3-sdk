import tokens from '../constants/tokens'


export default {
  api: {
    backend: 'https://api.stakewise.io/graphql',
    subgraph: 'https://graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  network: {
    chainId: 1,
    id: 'mainnet',
    name: 'Ethereum',
    hexadecimalChainId: '0x1',
    blockExplorerUrl: 'https://etherscan.io',
    url: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
    nativeCurrency: {
      symbol: tokens.eth,
      name: 'Ethereum',
      decimals: 18,
    },
  },
  pages: {
    etherscan: 'https://etherscan.io',
    beaconchain: 'https://beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      mintToken: '',
      v2RewardToken: '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
      v2StakedToken: '0xFe2e637202056d30016725477c5da089Ab0A043A',
    },
    base: {
      keeper: '',
      priceOracle: '',
      vaultsRegistry: '',
      sharedMevEscrow: '',
      mintTokenConfig: '',
      multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
      rewardSplitterFactory: '',
    },
    factories: {
      vault: '',
      erc20Vault: '',
      privateVault: '',
      erc20PrivateVault: '',
      vestingEscrow: '0x7B910cc3D4B42FEFF056218bD56d7700E4ea7dD5',
    },
  },
  tokens: {
    mintToken: tokens.osETH,
    nativeToken: tokens.eth,
    depositToken: tokens.eth,
    v2RewardToken: tokens.rETH2,
    v2StakedToken: tokens.sETH2,
  },
} as const
