import { ZeroAddress } from 'ethers'

import tokens from '../constants/tokens'
import { Network } from '../enums'


export default {
  api: {
    backend: 'https://api-gnosis.stakewise.io/graphql',
    subgraph: 'https://chiado-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  network: {
    id: 'chiado',
    name: 'Chiado Chain',
    chainId: Network.Chiado,
    hexadecimalChainId: '0x27D8',
    url: 'https://rpc.chiadochain.net',
    blockExplorerUrl: 'https://gnosis-chiado.blockscout.com/',
    nativeCurrency: {
      symbol: tokens.xdai,
      name: tokens.xdai,
      decimals: 18,
    },
  },
  pages: {
    beaconchain: 'https://gnosis.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0xfdA94F056346d2320d4B5E468D6Ad099b2277746', // ???
      mintToken: '0x3Be1c4315AbE43D0EA1D45567f6c0f3f1faa989e',
      v2RewardToken: ZeroAddress,
      v2StakedToken: ZeroAddress,
      strk: ZeroAddress,
    },
    base: {
      keeper: '0x47Bf64605a71f5ea1FBE230735ab04669cC312D5',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0x818D058a0178550841693433204Fd5da44AbAEAb',
      vaultsRegistry: '0x61E12791C717B80CcE1a50bC97548fA281493e2a',
      sharedMevEscrow: '0xcb6D1AB7c1748762D4D3c974a30cBa4B99aaFAee',
      mintTokenConfig: '0x3BEc3c1cf81A1176c12550B4315bdd53A2B4Fd5D',
      mintTokenController: '0xfCB470E6b996d078A4F82bEeF671A030eD365E45',
      rewardSplitterFactory: '0x0eDa71e5090a07273BAC11453677D3af2037c575',
    },
    factories: {
      vault: '0x68D17eFa7cf9e1d121e9ff6138f2336bDB1CcBcA',
      erc20Vault: '0x75E6f7640137c128c91dE4Ee62F6f30b542e5f1B',

      privateVault: '0x76747FeE60601be298E84A8a3D4D2D0dc82555F4',
      erc20PrivateVault: '0xbe1ea5FA6dBA700D2c94A0bc6C9faf197550D323',

      blocklistVault: '0xB790391ee99b9193Ebb80022bf127d24Bac586c4',
      erc20BlocklistVault: '0x61D8F23C220a62D61cE8c21BF98f8f39D764dA8D',
    },
    uniswap: {
      positionManager: ZeroAddress,
    },
  },
  tokens: {
    mintToken: tokens.osGNO,
    nativeToken: tokens.xdai,
    depositToken: tokens.gno,
    v2RewardToken: tokens.rGNO,
    v2StakedToken: tokens.sGNO,
  },
  isTestnet: true,
} as const
