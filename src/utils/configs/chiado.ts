import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.chiado,
  api: {
    backend: 'https://chiado-api.stakewise.io/graphql',
    subgraph: 'https://graphs.stakewise.io/chiado/subgraphs/name/stakewise/prod',
  },
  pages: {
    beaconchain: 'https://beacon.chiadochain.net',
  },
  addresses: {
    tokens: {
      ssv: ZeroAddress,
      obol: ZeroAddress,
      swise: '0x460d2c6c3254809949a7d0b4646ce15F77e9c545',
      mintToken: '0x0b4F6bFB694790051E0203Db83edbB5888099556',
      depositToken: '0x19C653Da7c37c66208fbfbE8908A5051B57b4C70',
      v2RewardToken: '0x14c74b1C7eCa8362D4ABcCd71051Ce174d61a3D4',
      v2StakedToken: '0xee2493a42861a0a49f88525c44aab8126d04b761',
    },
    base: {
      keeper: '0x5f31eD13eBF81B67a9f9498F3d1D2Da553058988',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0x3CC131e6f6b975423151E5aaE8C466f4f81A8A4c',
      vaultsRegistry: '0x8750594B33516232e751C8B9C350a660cD5f1BB8',
      sharedMevEscrow: '0x453056f0bc4631abB15eEC656139f88067668E3E',
      mintTokenConfigV1: ZeroAddress,
      mintTokenConfigV2: '0x6D5957e075fd93b3B9F36Da93d7462F14387706d',
      depositDataRegistry: '0xFAce8504462AEb9BB6ae7Ecb206BD7B1EdF7956D',
      mintTokenController: '0x5518052f2d898f062ee59964004A560F24E2eE7d',
      rewardSplitterFactory: '0xC64c8107C121E7f27a1Be440c2A1cBab8d0f1E88',
    },
    factories: {
      vault: '0x7212A20cc0679b22f794F5E36F94Ae4BA3513aB7',
      erc20Vault: '0x5293D058c276e157F5F6F7BAd5A85FE20d6b4138',

      privateVault: '0x147e6e6fc769a34C099a6c90b0b34Bb9e5029B75',
      erc20PrivateVault: '0xd57C92A6f63e9E9303625B312D972dCAfAc9Ebca',

      blocklistVault: '0x15588E8E732C0F2907ee4f6FeFbC5396b044B0De',
      erc20BlocklistVault: '0xbFfF1C541537933848AF0b816162CB7D4E90004a',
    },
    special: {
      stakeCalculator: '0x35704E96851d4aDd48475757b8f9bbb2390D9e4E',
      leverageStrategy: ZeroAddress,
      merkleDistributorV2: '0xd0747320d5457256D0203dfe61209Afbb90d22D7',
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
