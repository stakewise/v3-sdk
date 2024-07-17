import { Network } from './enums'


type Input = {
  network: Network
  vaultAddress: string
  contracts: StakeWise.Contracts
}

const getVaultContract = (values: Input) => {
  const { vaultAddress, network, contracts } = values

  const isNativeToken = [ Network.Holesky, Network.Mainnet ].includes(network)

  if (isNativeToken) {
    return contracts.helpers.createVault(vaultAddress)
  }

  return contracts.helpers.createOtherTokenVault(vaultAddress)
}


export default getVaultContract
