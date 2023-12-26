import tokens from '../constants/tokens'


export default {
  api: {
    backend: 'https://mainnet-api.stakewise.io/graphql',
    subgraph: 'https://mainnet-graph.stakewise.io/subgraphs/name/stakewise/stakewise1',
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
      mintToken: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
      v2RewardToken: '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
      v2StakedToken: '0xFe2e637202056d30016725477c5da089Ab0A043A',
    },
    base: {
      keeper: '0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5',
      priceOracle: '0x8023518b2192FB5384DAdc596765B3dD1cdFe471',
      vaultsRegistry: '0x3a0008a588772446f6e656133C2D5029CC4FC20E',
      sharedMevEscrow: '0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86',
      mintTokenConfig: '0xE8822246F8864DA92015813A39ae776087Fb1Cd5',
      mintTokenController: '0x2A261e60FB14586B474C208b1B7AC6D0f5000306',
      multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
      rewardSplitterFactory: '0x90a9428b8c58cA80B28aAF46B936D42e87797449',
    },
    factories: {
      vault: '0xDada5a8E3703B1e3EA2bAe5Ab704627eb2659fCC',
      erc20Vault: '0x6DDc10eEeEBbBcF00E784bA44Fe4B038af26cB53',
      privateVault: '0x170618936cd96B1eD8112eC3D3778374B38DFe5e',
      erc20PrivateVault: '0xe84183EfFbcc76D022Cccc31b95EAa332bB5Bb11',
    },
    uniswap: {
      positionManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
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
