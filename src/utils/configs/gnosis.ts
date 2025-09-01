import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.gnosis,
  api: {
    backend: 'https://gnosis-api-b.stakewise.io/graphql',
    subgraph: 'https://graphs.stakewise.io/gnosis/subgraphs/name/stakewise/prod',
  },
  pages: {
    beaconchain: 'https://gnosis.beaconcha.in',
  },
  addresses: {
    tokens: {
      ssv: ZeroAddress,
      obol: ZeroAddress,
      swise: '0xfdA94F056346d2320d4B5E468D6Ad099b2277746',
      mintToken: '0xF490c80aAE5f2616d3e3BDa2483E30C4CB21d1A0',
      depositToken: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
      v2RewardToken: '0x6aC78efae880282396a335CA2F79863A1e6831D4',
      v2StakedToken: '0xA4eF9Da5BA71Cc0D2e5E877a910A37eC43420445',
    },
    base: {
      keeper: '0xcAC0e3E35d3BA271cd2aaBE688ac9DB1898C26aa',
      multicall: '0xb5b692a88BDFc81ca69dcB1d924f59f0413A602a',
      priceOracle: '0x9B1b13afA6a57e54C03AD0428a4766C39707D272',
      vaultsRegistry: '0x7d014B3C6ee446563d4e0cB6fBD8C3D0419867cB',
      sharedMevEscrow: '0x30db0d10d3774e78f8cB214b9e8B72D4B402488a',
      mintTokenConfigV1: ZeroAddress,
      mintTokenConfigV2: '0xd6672fbE1D28877db598DC0ac2559A15745FC3ec',
      depositDataRegistry: '0x58e16621B5c0786D6667D2d54E28A20940269E16',
      mintTokenController: '0x60B2053d7f2a0bBa70fe6CDd88FB47b579B9179a',
      rewardSplitterFactory: '0x4c6306BA1821D88803e27A115433520F2d6276Fb',
    },
    factories: {
      vault: '0xC2ecc7620416bd65bfab7010B0db955a0e49579a',
      erc20Vault: '0xF6BBBc05536Ab198d4b7Ab74a93f8e2d4cAd5354',

      privateVault: '0x574952EC88b2fC271d0C0dB130794c86Ea42139A',
      erc20PrivateVault: '0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86',

      blocklistVault: '0x78FbfBd1DD38892476Ac469325df36604A27F5B7',
      erc20BlocklistVault: '0x99E4300326867FE3f97864a74e500d19654c19e9',
    },
    special: {
      stakeCalculator: '0x2A415b65207049AC7481BF69ff9fc1B3Def97c9A',
      leverageStrategy: ZeroAddress,
      leverageStrategyV2: ZeroAddress,
      merkleDistributorV2: '0xFBceefdBB0ca25a4043b35EF49C2810425243710',
    },
  },
  tokens: {
    ssv: constants.tokens.ssv,
    obol: constants.tokens.obol,
    swise: constants.tokens.swise,
    mintToken: constants.tokens.osGNO,
    nativeToken: constants.tokens.xdai,
    depositToken: constants.tokens.gno,
    v2RewardToken: constants.tokens.rGNO,
    v2StakedToken: constants.tokens.sGNO,
  },
} as const
