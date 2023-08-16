import { VaultQueryPayload } from '../../graphql/subgraph/vault'
import { VaultValidatorsQueryPayload } from '../../graphql/backend/vault'

import { ModifiedData as ModifyData } from './util/modifyVaultData'


declare global {

  declare namespace Vault {

    type SubgraphData = VaultQueryPayload
    type SubgraphValidatorsData = VaultValidatorsQueryPayload

    type ModifiedData = ModifyData<SubgraphData['vault']> & {
      privateVaultAccounts: SubgraphData['privateVaultAccounts']
    }

    type Whitelist = VaultQueryPayload['privateVaultAccounts']
    type ValidatorData = SubgraphValidatorsData['vaults'][number]['validators'][number]
    type AllocatorAction = AllocatorActionsQueryPayload['allocatorActions'][number]

    type Validator = {
      apy: string
      link: string
      createdAt: number
      earned: ValidatorData['earned']
      publicKey: ValidatorData['publicKey']
    }

    type Performance = {
      mev: number
      total: number
      insurance: number
      ownCapital: number
      validators: number
      networkShare: number
      geoDiversity: number
      clientDiversity: number
      validationPerformance: number
    }

    type AllocatorActions = Array<{
      link: string
      assets: AllocatorAction['assets']
      actionType: AllocatorAction['actionType']
      createdAt: AllocatorAction['createdAt']
    }>

    type FetchVaultData = Pick<
      ModifiedData,
      'apy' | 'isErc20' | 'imageUrl' | 'isPrivate' | 'tokenName' | 'createdAt'
      | 'tokenSymbol' | 'displayName' | 'description' | 'whitelister'
      | 'validatorsRoot' | 'feeRecipient' | 'totalAssets' | 'capacity'
    > & {
      totalPerformance: ModifiedData['performance']['total']
      vaultKeysManager: ModifiedData['keysManager']
      mevRecipient: ModifiedData['mevEscrow']
      vaultAddress: ModifiedData['address']
      vaultAdmin: ModifiedData['admin']
      performance: Performance
      isSmoothingPool: boolean
      createdAt: string
      whitelist: Whitelist
      feePercent: string
    }

    type FetchValidatorsData = Validator[]

    type Data = FetchVaultData & {
      validators: FetchValidatorsData
    }
  }
}
