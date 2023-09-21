const { StakeWiseSDK, Network } = require('./dist')


const call = async () => {
  const sdk = new StakeWiseSDK({ network: Network.Goerli })

  const { thresholdPercent } = await sdk.requests.getOsTokenData()

  console.log('thresholdPercent', thresholdPercent)

  const { assets } = await sdk.requests.getStakeBalance({
    userAddress: '0xEC01cB780202595Ce2Fb11225aABfAd201B54e0f',
    vaultAddress: '0xbc1a14cd1d4fabea06f9b50346dd2163dd783181',
  })

  console.log('assets', assets)

  const result = await sdk.requests.getMintToken({
    thresholdPercent,
    stakedAssets: assets,
    userAddress: '0xEC01cB780202595Ce2Fb11225aABfAd201B54e0f',
    vaultAddress: '0xbc1a14cd1d4fabea06f9b50346dd2163dd783181',
  })

  console.log(result)
}

call()
