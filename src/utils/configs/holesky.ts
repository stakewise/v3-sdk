import { ZeroAddress } from 'ethers'

import tokens from '../constants/tokens'
import { Network } from '../enums'


export default {
  api: {
    backend: 'https://holesky-api.stakewise.io/graphql',
    subgraph: 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  network: {
    id: 'holesky',
    name: 'Holesky Testnet',
    chainId: Network.Holesky,
    forkVersion: '0x01017000',
    hexadecimalChainId: '0x4268',
    url: 'https://ethereum-holesky.publicnode.com/',
    blockExplorerUrl: 'https://holesky.etherscan.io',
    nativeCurrency: {
      symbol: tokens.eth,
      name: 'Ethereum',
      decimals: 18,
    },
  },
  pages: {
    etherscan: 'https://holesky.etherscan.io',
    beaconchain: 'https://holesky.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x484871C6D54a3dAEBeBBDB0AB7a54c97D72986Bb',
      mintToken: '0xF603c5A3F774F05d4D848A9bB139809790890864',
      v2RewardToken: ZeroAddress,
      v2StakedToken: ZeroAddress,
      strk: '0xe8a222D887b468a71Ee8a27df4fa3b886A4B7BA1',
    },
    base: {
      keeper: '0xB580799Bf7d62721D1a523f0FDF2f5Ed7BA4e259',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0xe31FAf135A6047Cbe595F91B4b6802cDB9B46E2b',
      vaultsRegistry: '0xAa773c035Af95721C518eCd8250CadAC0AAB7ed0',
      sharedMevEscrow: '0xc98F25BcAA6B812a07460f18da77AF8385be7b56',
      mintTokenConfig: '0x4483965Ed85cd5e67f2a7a0EB462aCcC37b23D72',
      mintTokenController: '0x7BbC1733ee018f103A9a9052a18fA9273255Cf36',
      rewardSplitterFactory: '0x6c56AC64457B8AeA1Bb8d1f5eA2d1E397C9c7a13',
    },
    factories: {
      vault: '0x1428BB71261f01BbC03ce4eC7cEEA674f94b5F18',
      erc20Vault: '0x4C1140F4A5E3DD459De642A46bd1df6FBe287e1B',
      privateVault: '0x9741f8e49fFa322714511b5D17bD052698eAFA43',
      erc20PrivateVault: '0x930A2D0ADEbF4E69Bb929F6456C3D4bcabf52796',
    },
    uniswap: {
      positionManager: ZeroAddress,
    },
  },
  tokens: {
    mintToken: tokens.osETH,
    nativeToken: tokens.eth,
    depositToken: tokens.eth,
    v2RewardToken: tokens.rETH2,
    v2StakedToken: tokens.sETH2,
  },
  isTestnet: true,
} as const
