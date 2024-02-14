import { getAddress } from 'ethers'

import { ModifiedWhitelist } from './types'
import type { WhitelistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'


type ModifyWhitelistInput = {
  data: WhitelistAccountsQueryPayload
}

const modifyAddress = ({ createdAt, address }: { createdAt: string, address: string }) => ({
  createdAt: Number(createdAt) * 1000,
  address: getAddress(address),
})

const modifyWhitelist = (input: ModifyWhitelistInput): ModifiedWhitelist => {
  const { data } = input
  const { privateVaultAccounts } = data

  return privateVaultAccounts.map(modifyAddress)
}


export default modifyWhitelist
