import { getAddress } from 'ethers'

import { ModifiedBlocklist } from './types'
import type { BlocklistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'


type ModifyBlocklistInput = {
  data: BlocklistAccountsQueryPayload
}

const modifyAddress = ({ createdAt, address }: { createdAt: string, address: string }) => ({
  createdAt: Number(createdAt) * 1000,
  address: getAddress(address),
})

const modifyBlocklist = (input: ModifyBlocklistInput): ModifiedBlocklist => {
  const { data } = input
  const { vaultBlockedAccounts } = data

  return vaultBlockedAccounts.map(modifyAddress)
}


export default modifyBlocklist
