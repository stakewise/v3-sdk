import { describe, expect } from 'vitest'

import { it, proof, rewardsRoot, vaultAddress, subVaultAddress } from '..'
import createSnapshot from './createSnapshot'


const block = 123

const meta = { block: { number: block } }

const vault = {
  proof,
  rewardsRoot,
  reward: '100',
  id: vaultAddress,
  canHarvest: true,
  isMetaVault: false,
  unlockedMevReward: '5',
}

describe('createSnapshot', () => {
  it('snapshot', () => {
    const snapshot = createSnapshot({ _meta: meta, vaults: [ vault ] })

    expect(snapshot).toEqual({
      block,
      vaultAddress,
      harvestParams: {
        proof,
        rewardsRoot,
        reward: '100',
        canHarvest: true,
        isMetaVault: false,
        unlockedMevReward: '5',
      },
    })
  })

  it('first vault', () => {
    const other = { ...vault, id: subVaultAddress }
    const snapshot = createSnapshot({ _meta: meta, vaults: [ vault, other ] })

    expect(snapshot.vaultAddress).toBe(vaultAddress)
  })

  it('no vault', () => {
    expect(() => createSnapshot({ _meta: meta, vaults: [] })).toThrow(`No vault found at block ${block}`)
  })

  it('cannot harvest', () => {
    const response = { _meta: meta, vaults: [ { ...vault, canHarvest: false } ] }

    expect(() => createSnapshot(response)).toThrow(
      `${vaultAddress} cannot harvest at block ${block}, retry later or pass another vault`
    )
  })
})
