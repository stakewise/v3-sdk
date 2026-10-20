import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'

import configs from '../src/helpers/configs'
import createSnapshot from '../test/fork/createSnapshot'
import getVaultFilter from '../test/fork/getVaultFilter'
import type { ForkSnapshot } from '../test/fork/snapshots'
import type { SnapshotResponse } from '../test/fork/createSnapshot'
import parseForkNetwork, { forkNetworkNames } from '../test/fork/parseForkNetwork'


type FetchResponseInput = {
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

const fetchResponse = async ({ url, where }: FetchResponseInput) => {
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

const readSavedVault = async (filePath: string) => {
  if (!existsSync(filePath)) {
    return undefined
  }

  const { vaultAddress }: ForkSnapshot = JSON.parse(await readFile(filePath, 'utf8'))

  return vaultAddress
}

const main = async ([ name, vault ]: string[]) => {
  if (!name) {
    throw new Error(`Pass a network: ${forkNetworkNames.join(', ')}`)
  }

  const network = parseForkNetwork(name)
  const [ url ] = configs[network].api.subgraph
  const filePath = fileURLToPath(new URL(`../test/fork/mocks/${name}.json`, import.meta.url))
  const savedVault = await readSavedVault(filePath)
  const where = getVaultFilter({ vault, savedVault })
  const response = await fetchResponse({ url, where })
  const snapshot = createSnapshot(response)

  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`)

  console.log(`${name}: block ${snapshot.block}, vault ${snapshot.vaultAddress}`)
}


main(process.argv.slice(2)).catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
