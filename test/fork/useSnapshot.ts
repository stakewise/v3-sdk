import { afterAll, beforeAll } from 'vitest'
import type { JsonRpcProvider } from 'ethers'


const useSnapshot = (provider: JsonRpcProvider) => {
  let snapshotId = ''

  beforeAll(async () => {
    snapshotId = await provider.send('evm_snapshot', [])
  })

  afterAll(async () => {
    const isReverted = await provider.send('evm_revert', [ snapshotId ])

    if (!isReverted) {
      throw new Error(`anvil could not revert to the snapshot ${snapshotId}`)
    }
  })
}


export default useSnapshot
