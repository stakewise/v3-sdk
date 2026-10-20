import { describe, expect } from 'vitest'
import { MaxUint256, parseEther } from 'ethers'

import { useForkSdk } from '../../../../test/fork'
import { it, userAddress, spenderAddress } from '../../../../test'


const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const permitAmount = parseEther('0.5')

const permitCases = [
  { name: 'default amount', amount: undefined, allowance: MaxUint256 },
  { name: 'custom amount', amount: permitAmount, allowance: permitAmount },
]

describe('getPermitSignature', () => {
  const { sdk, provider } = useForkSdk()

  it.for(permitCases)('$name', async ({ amount, allowance }) => {
    const nonceBefore = await sdk.contracts.tokens.mintToken.nonces(ownerAddress)

    const signature = await sdk.utils.getPermitSignature({
      amount,
      ownerAddress,
      spenderAddress,
      contract: sdk.contracts.tokens.mintToken,
    })

    const { amount: signedAmount, deadline, v, r, s } = signature

    const signer = await provider.getSigner(userAddress)
    const signedMintTokenContract = sdk.contracts.tokens.mintToken.connect(signer)
    const permitTx = await signedMintTokenContract.permit(ownerAddress, spenderAddress, signedAmount, deadline, v, r, s)
    const permitReceipt = await permitTx.wait()

    const [ allowanceAfter, nonceAfter ] = await Promise.all([
      sdk.contracts.tokens.mintToken.allowance(ownerAddress, spenderAddress),
      sdk.contracts.tokens.mintToken.nonces(ownerAddress),
    ])

    expect(signedAmount).toBe(allowance)
    expect(permitReceipt?.status).toBe(1)
    expect(allowanceAfter).toBe(allowance)
    expect(nonceAfter).toBe(nonceBefore + 1n)
  })
})
