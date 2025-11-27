import { vaultMulticall } from '../../../../contracts'
import getVault from '../../requests/getVault'


export type VaultMulticallInput = Pick<Parameters<
  typeof vaultMulticall>[0], 'request' | 'userAddress' | 'vaultAddress'
> & StakeWise.CommonParams

export const multicall = async <T extends unknown>(values: VaultMulticallInput) => {
    const { vaultAddress, request, contracts, config } = values

    const { isBlocklist, isPrivate, version } = await getVault(values)

    const vaultContract = contracts.helpers.createVault({
      options: {
        isPrivate,
        isBlocklist,
        isDepositWithMint: version >= 3,
        chainId: config.network.chainId,
      },
      vaultAddress,
    })

    return vaultMulticall<T>({
      vaultContract,
      ...values,
      request,
    })
  }
