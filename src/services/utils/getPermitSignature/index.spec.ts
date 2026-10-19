import { describe, expect } from 'vitest'
import { MaxUint256 } from 'ethers'

import { userAddress, it as baseIt, spenderAddress } from '../../../../test'


const r = `0x${'11'.repeat(32)}`
const s = `0x${'22'.repeat(32)}`
const signature = `${r}${s.slice(2)}1b`

const nowSeconds = 1_800_000_000
const permitDuration = 3600

const it = baseIt.extend('permitMocks', ({ sdk, runner }) => {
  const mintTokenContract = sdk.contracts.tokens.mintToken
  const input = { contract: mintTokenContract, ownerAddress: userAddress, spenderAddress }

  runner.on(mintTokenContract, {
    name: [ 'osETH' ],
    nonces: [ 7n ],
  })
  runner.onRpc('eth_signTypedData_v4', () => signature)

  const getSignedData = () => {
    const [ signer, typedData ] = runner.rpcCalls[0].params

    return { signer, ...JSON.parse(typedData) }
  }

  return { mintTokenContract, input, getSignedData }
})

describe('getPermitSignature', () => {

  it.beforeEach(({ clock }) => {
    clock.setSystemTime(nowSeconds * 1000)
  })

  it('no BigInt polyfill', () => {
    expect(BigInt.prototype).not.toHaveProperty('toJSON')
  })

  it('max amount by default', async ({ sdk, permitMocks }) => {
    const { mintTokenContract, input, getSignedData } = permitMocks

    const result = await sdk.utils.getPermitSignature(input)
    const verifyingContract = await mintTokenContract.getAddress()
    const { signer, domain, message } = getSignedData()

    expect(signer).toBe(userAddress)
    expect(domain).toMatchObject({
      name: 'osETH',
      version: '1',
      chainId: 1,
      verifyingContract,
    })
    expect(message).toMatchObject({
      owner: userAddress,
      spender: spenderAddress,
      nonce: '7',
      value: MaxUint256.toString(),
    })
    expect(result).toMatchObject({ amount: MaxUint256, v: 27, r, s })
  })

  it('custom amount', async ({ sdk, permitMocks }) => {
    const { input, getSignedData } = permitMocks

    const result = await sdk.utils.getPermitSignature({ ...input, amount: 5n })
    const { message } = getSignedData()

    expect(message.value).toBe('5')
    expect(result.amount).toBe(5n)
  })

  it('EIP-712 permit', async ({ sdk, permitMocks }) => {
    const { input, getSignedData } = permitMocks

    const result = await sdk.utils.getPermitSignature(input)
    const { primaryType, types, message } = getSignedData()
    const deadline = nowSeconds + permitDuration

    expect(primaryType).toBe('Permit')
    expect(types.Permit).toEqual([
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ])
    expect(message.deadline).toBe(deadline)
    expect(result.deadline).toBe(deadline)
  })
})
