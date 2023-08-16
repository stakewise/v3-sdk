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

    type Data = Pick<
      ModifiedSubgraphData,
      'apy' | 'totalAssets' | 'imageUrl' | 'tokenName' | 'isPrivate' | 'isErc20'
      | 'tokenSymbol' | 'whitelister' | 'description' | 'displayName'
      | 'feeRecipient' | 'capacity' | 'createdAt' | 'validatorsRoot'
    > & {
      totalPerformance: ModifiedSubgraphData['performance']['total']
      vaultKeysManager: ModifiedSubgraphData['keysManager']
      mevRecipient: ModifiedSubgraphData['mevEscrow']
      vaultAddress: ModifiedSubgraphData['address']
      vaultAdmin: ModifiedSubgraphData['admin']
      isValidatorsFetching: boolean
      isVaultKeysManager: boolean
      performance: Performance
      isSmoothingPool: boolean
      validators: Validator[]
      createdAtTime: string
      whitelist: Whitelist
      feePercent: string
      isPrivate: boolean
    }
  }
}
