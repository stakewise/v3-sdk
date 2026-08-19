const convertOsTokenSharesToAssets = (shares: bigint, totalAssets: bigint, totalSupply: bigint): bigint => (
  totalSupply === 0n ? shares : shares * totalAssets / totalSupply
)


export default convertOsTokenSharesToAssets
