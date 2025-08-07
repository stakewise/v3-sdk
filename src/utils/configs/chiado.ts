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
      rewardSplitterFactory: '0x70Deba2ACC7145f1920df2E22Bb1c2eFe48fAcF5',
    },
    factories: {
      vault: '0xdEa6962DC2988b6961f9C52b05a6fE2727626a75',
      erc20Vault: '0x139BfBB32893ab8AC3cCAdCbd10B3EE6a1FE0Aa9',

      privateVault: '0x54C659aBFA80956ddBE89Fd9266e0C6626626672',
      erc20PrivateVault: '0x67870ebfe9562F25113a43Cad106D7816b8Ab87B',

      blocklistVault: '0x64f9812c1D24A5d1C318FF522b365CD64208B810',
      erc20BlocklistVault: '0xD0BC673f60adf49BA97965BdA557a4780798B5Ec',
    },
    special: {
      stakeCalculator: '0x35704E96851d4aDd48475757b8f9bbb2390D9e4E',
      leverageStrategy: ZeroAddress,
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
