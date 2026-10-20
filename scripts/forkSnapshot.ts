import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'

import configs from '../src/helpers/configs'
import { snapshots } from '../test/fork/snapshots'
import type { ForkSnapshot } from '../test/fork/snapshots'
import parseForkNetwork, { forkNetworkNames } from '../test/fork/parseForkNetwork'


type SnapshotVault = ForkSnapshot['harvestParams'] & {
  id: string
}

type GraphqlResponse = {
  data?: {
    _meta: { block: { number: number } }
    vaults: SnapshotVault[]
  }
  errors?: Array<{ message: string }>
}

const harvestableVaultFilter = {
  canHarvest: true,
  isPrivate: false,
  isMetaVault: false,
  isBlocklist: false,
}

const query = `
  query ForkSnapshot($where: Vault_filter!) {
    _meta { block { number } }
    vaults(where: $where, orderBy: totalAssets, orderDirection: desc, first: 1) {
      id
      proof
      canHarvest
      rewardsRoot
      isMetaVault
      reward: proofReward
      unlockedMevReward: proofUnlockedMevReward
    }
  }
`

const fetchSnapshot = async (url: string, vault?: string): Promise<ForkSnapshot> => {
  const where = vault ? { id: vault.toLowerCase() } : harvestableVaultFilter

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { where } }),
  })
    .catch(() => {
      throw new Error('Subgraph request failed')
    })

  if (!response.ok) {
    throw new Error(`Subgraph responded with HTTP ${response.status}`)
  }

  const { data, errors }: GraphqlResponse = await response.json()

  if (errors?.length) {
    throw new Error(`Subgraph error: ${errors.map(({ message }) => message).join('; ')}`)
  }

  if (!data) {
    throw new Error('Subgraph returned no data')
  }

  const { number: block } = data._meta.block
  const [ snapshotVault ] = data.vaults

  if (!snapshotVault) {
    throw new Error(`No vault found at block ${block}`)
  }

  const { id, proof, canHarvest, rewardsRoot, isMetaVault, reward, unlockedMevReward } = snapshotVault

  if (!canHarvest) {
    throw new Error(`${id} cannot harvest at block ${block}, retry later or pass another vault`)
  }

  return {
    block,
    vaultAddress: id,
    harvestParams: {
      proof,
      canHarvest,
      rewardsRoot,
      isMetaVault,
      reward,
      unlockedMevReward,
    },
  }
}

const main = async ([ name, vault ]: string[]) => {
  if (!name) {
    throw new Error(`Pass a network: ${forkNetworkNames.join(', ')}`)
  }

  const network = parseForkNetwork(name)
  const [ url ] = configs[network].api.subgraph
  const filePath = fileURLToPath(new URL(`../test/fork/mocks/${name}.json`, import.meta.url))
  const snapshot = await fetchSnapshot(url, vault || snapshots[network]?.vaultAddress)

  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`)

  console.log(`${name}: block ${snapshot.block}, vault ${snapshot.vaultAddress}`)
}


main(process.argv.slice(2)).catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
