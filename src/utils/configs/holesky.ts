import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.holesky,
  api: {
    backend: 'https://holesky-api.stakewise.io/graphql',
    subgraph: 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  pages: {
    beaconchain: 'https://holesky.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x484871C6D54a3dAEBeBBDB0AB7a54c97D72986Bb',
      mintToken: '0xF603c5A3F774F05d4D848A9bB139809790890864',
      depositToken: ZeroAddress,
      v2RewardToken: '0xd57c19f20168406d162852515030e00e49bB7781',
      v2StakedToken: '0xFb534BB912Eb83b7b629329195b8DF798Ea325b2',
    },
    base: {
      keeper: '0xB580799Bf7d62721D1a523f0FDF2f5Ed7BA4e259',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0xe31FAf135A6047Cbe595F91B4b6802cDB9B46E2b',
      vaultsRegistry: '0xAa773c035Af95721C518eCd8250CadAC0AAB7ed0',
      sharedMevEscrow: '0xc98F25BcAA6B812a07460f18da77AF8385be7b56',
      mintTokenConfig: '0x8f347eb308707DC1FA1acCF3ea889CF554b6B8A5',
      depositDataRegistry: '0x1Dfb40a149940300f183d21E5B200c5DaaF3A842',
      mintTokenController: '0x7BbC1733ee018f103A9a9052a18fA9273255Cf36',
      rewardSplitterFactory: '0x384B388A040C6b32c9B5927aB25891F2bAd4E5f7',
    },
    balancer: {
      vault: ZeroAddress,
    },
    factories: {
      vault: '0xc93C070124Cb78fE9Dee9F0527168F81850a384b',
      erc20Vault: '0x2B324944213F5781A23A07ea3f55884b535DcF36',

      privateVault: '0xDe0b026f1A7b143A650732EdcCce5a30784BFe20',
      erc20PrivateVault: '0x400f8E12c8503D6803141E3F5CCc3e0C01A44899',

      blocklistVault: '0x1F05A6F83e72732046DF4cac3215d1fd00E2Bc5C',
      erc20BlocklistVault: '0x76FC9b44D4b18eef3CdF8FEeee0B926775F00e6e',
    },
    uniswap: {
      positionManager: ZeroAddress,
    },
  },
  tokens: {
    mintToken: constants.tokens.osETH,
    nativeToken: constants.tokens.eth,
    depositToken: constants.tokens.eth,
    v2RewardToken: constants.tokens.rETH2,
    v2StakedToken: constants.tokens.sETH2,
  },
} as const
