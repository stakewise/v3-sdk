import { Signature } from 'ethers'

import { constants } from '../../../utils'


const maxUint256 = constants.blockchain.maxUint256

type GetPermitSignatureInput = {
  options: StakeWise.Options
  provider: StakeWise.Provider
  contract: StakeWise.ABI.Erc20Token
  amount?: bigint
  ownerAddress: string
  spenderAddress: string
}

const getPermitSignature = async (values: GetPermitSignatureInput) => {
  const { options, provider, amount = maxUint256, contract, ownerAddress, spenderAddress } = values

  const currentTimestamp = Number((Date.now() / 1000).toFixed(0))
  const deadline = currentTimestamp + 3600 // + 1 hour

  const [ tokenName, mintTokenAddress, tokenNonce ] = await Promise.all([
    contract.name(),
    contract.getAddress(),
    contract.nonces(ownerAddress),
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
      owner: ownerAddress,
      nonce: tokenNonce.toString(),
      spender: spenderAddress,
      value: amount,
    },
  })

  const signature = await provider.send('eth_signTypedData_v4', [ ownerAddress, data ])
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
