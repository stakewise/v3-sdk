import type { SubVaultsQueryPayload } from '../../../../graphql/subgraph/vault'


type ModifiedSubVault = {
  id: string
  apy: string
  imageUrl: string
  displayName: string
  stakingAssets: bigint
  exitingAssets: bigint
}

const modifySubVaults = (data: SubVaultsQueryPayload): ModifiedSubVault[] => {
  return data.subVaults.map(({ subVault }) => {
    const { id, imageUrl, displayName, allocators, exitRequests } = subVault

    const [ allocator ] = allocators
    const exitingAssets = exitRequests.reduce((acc, { totalAssets }) => (
      acc + BigInt(totalAssets)
    ), 0n)

    const apy = Number(allocator?.apy) || 0

    return {
      id,
      apy: apy.toFixed(2),
      imageUrl: imageUrl || '',
      displayName: displayName || '',
      stakingAssets: BigInt(allocator?.assets || 0),
      exitingAssets,
    }
  })
}


export default modifySubVaults
