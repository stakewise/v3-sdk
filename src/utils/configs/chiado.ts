import { ZeroAddress } from 'ethers'

import tokens from '../constants/tokens'
import { Network } from '../enums'


export default {
  api: {
    backend: 'https://holesky-api.stakewise.io/graphql',
    subgraph: 'https://chiado-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  network: {
    id: 'chiado',
    name: 'Chiado Testnet',
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
      swise: '0x460d2c6c3254809949a7d0b4646ce15F77e9c545',
      mintToken: '0x555f0C927E853aEa52f88ca9f5a7b4f215cBe039',
      depositToken: '0x19C653Da7c37c66208fbfbE8908A5051B57b4C70',
      v2RewardToken: ZeroAddress,
      v2StakedToken: ZeroAddress,
    },
    base: {
      keeper: '0x96Bd48CD98D2CC602b93A2BBbF05d7eEB21CdE8E',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0xf22F9Dba5281181D71F3EA42A8AfA13AF6B3E700',
      vaultsRegistry: '0x384B388A040C6b32c9B5927aB25891F2bAd4E5f7',
      sharedMevEscrow: '0xc7Eb19FcB20291A959ba90D11d2c6Fe8Db1F66b9',
      mintTokenConfig: '0x9a3d84D8FE20cDaBe8AeB74296C10C1DbED3dF81',
      depositDataRegistry: ZeroAddress,
      mintTokenController: '0xf99dc8Df363be34AbA6A4EAdE77c9d61e85b126F',
      rewardSplitterFactory: '0xE4480EcE26B697D42952a2380E42a88510020711',
    },
    balancer: {
      vault: ZeroAddress,
    },
    factories: {
      vault: '0xe79b759eF5835776b5A55A55552b86b57f66aA0E',
      erc20Vault: '0x765a1B647cd2020FD08CDD810CB1D00Eeb02E151',

      privateVault: '0xd65846faa8fB7C22777869E9eDDB13F4D0DeD3be',
      erc20PrivateVault: '0x352FA9D876910D51A1Ed309605c899a3D93773F1',

      blocklistVault: '0xf9706bd4540e59B1D3Bd77b5B9E55C2486a7a145',
      erc20BlocklistVault: '0x4e97Eca0aae622d49cc0ceC0e50a9880b1D6abD5',
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
