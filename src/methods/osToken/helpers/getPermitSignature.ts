import { Signature } from 'ethers'

import { Network, constants } from '../../../utils'


type GetPermitSignatureInput = {
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
  userAddress: string
  strategyProxy: string
}

const getPermitSignature = async (values: GetPermitSignatureInput) => {
  const { options, provider, contracts, userAddress, strategyProxy } = values

  const allowedNetworks = [ Network.Mainnet, Network.Holesky ]

  if (!allowedNetworks.includes(options.network)) {
    throw new Error('Permit signature is available only on Mainnet and Holeksy networks')
  }

  const currentTimestamp = Number((Date.now() / 1000).toFixed(0))
  const deadline = currentTimestamp + 3600 // + 1 hour
  const amount = constants.blockchain.maxUint256

  const [ tokenName, mintTokenAddress, tokenNonce ] = await Promise.all([
    contracts.tokens.mintToken.name(),
    contracts.tokens.mintToken.getAddress(),
    contracts.tokens.mintToken.nonces(userAddress),
  ])

  const data = JSON.stringify({
    primaryType: 'Permit',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    domain: {
      name: tokenName,
      version: '1',
      chainId: options.network,
      verifyingContract: mintTokenAddress,
    },
    message: {
      deadline,
      owner: userAddress,
      nonce: tokenNonce.toString(),
      spender: strategyProxy,
      value: amount,
    },
  })

  const signature = await provider.send('eth_signTypedData_v4', [ userAddress, data ])
  const { v, r, s } = await Signature.from(signature)

  return {
    amount,
    deadline,
    v,
    r,
    s,
  }
}


export default getPermitSignature
