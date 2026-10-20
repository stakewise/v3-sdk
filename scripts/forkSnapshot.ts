import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'

import configs from '../src/helpers/configs'
import { snapshots } from '../test/fork/snapshots'
import createSnapshot from '../test/fork/createSnapshot'
import getVaultFilter from '../test/fork/getVaultFilter'
import type { SnapshotResponse } from '../test/fork/createSnapshot'
import parseForkNetwork, { forkNetworkNames } from '../test/fork/parseForkNetwork'


type FetchSnapshotDataInput = {
  url: string
  where: ReturnType<typeof getVaultFilter>
}

type GraphqlResponse = {
  data?: SnapshotResponse
  errors?: Array<{ message: string }>
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

const fetchSnapshotData = async ({ url, where }: FetchSnapshotDataInput) => {
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

  return data
}

const main = async ([ name, vault ]: string[]) => {
  if (!name) {
    throw new Error(`Pass a network: ${forkNetworkNames.join(', ')}`)
  }

  const network = parseForkNetwork(name)
  const [ url ] = configs[network].api.subgraph
  const filePath = fileURLToPath(new URL(`../test/fork/mocks/${name}.json`, import.meta.url))
  const where = getVaultFilter({ vault, savedVault: snapshots[network]?.vaultAddress })
  const data = await fetchSnapshotData({ url, where })
  const snapshot = createSnapshot(data)

  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`)

  console.log(`${name}: block ${snapshot.block}, vault ${snapshot.vaultAddress}`)
}


main(process.argv.slice(2)).catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
