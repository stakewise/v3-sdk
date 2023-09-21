const { StakeWiseSDK, Network } = require('./dist')


const sdk = new StakeWiseSDK({ network: Network.Goerli })

sdk.requests.getStakeBalance({
    network: Network.Goerli,
    // types: [
    //   AllocatorActionType.Redeemed,
    //   AllocatorActionType.Deposited,
    //   AllocatorActionType.VaultCreated,
    //   AllocatorActionType.ExitedAssetsClaimed,
    // ],
    // skip: 0,
    // limit: 20,
    userAddress: '0xEC01cB780202595Ce2Fb11225aABfAd201B54e0f',
    vaultAddress: '0xbc1a14cd1d4fabea06f9b50346dd2163dd783181',
  })
  .then(console.log)
  .catch(console.error)
