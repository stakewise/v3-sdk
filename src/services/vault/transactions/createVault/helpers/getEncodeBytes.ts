import { AbiCoder, MaxUint256 } from 'ethers'

import type { CreateVaultTransactionInput } from '../types'


type EncodeBytesInput = Pick<CreateVaultTransactionInput,
  'type'
  | 'capacity'
  | 'vaultToken'
  | 'keysManagerFee'
  | 'metadataIpfsHash'
> & {
  isMetaVault: boolean
}

type GetTupleInput = Array<{
  type: keyof typeof tuple
  value: any
}>

const tuple = {
  tokenName: 'string name',
  tokenSymbol: 'string symbol',
  capacity: 'uint256 capacity',
  feePercent: 'uint16 feePercent',
  metadata: 'string metadataIpfsHash',
  curator: 'address subVaultsCurator',
}

const _getTuple = (values: GetTupleInput) => {
  let params: any[] = []
  let types = 'tuple('

  values.forEach((item, index) => {
    types += `${tuple[item.type]}`
    params.push(item.value)

    if (values.length - 1 > index) {
      types += ', '
    }
  })

  types += ')'

  return {
    types: [ types ],
    params: [ params ],
  }
}

const getEncodeBytes = (values: EncodeBytesInput) => {
  const { vaultToken , keysManagerFee, capacity, metadataIpfsHash, isMetaVault } = values

  const defaultAbiCoder = AbiCoder.defaultAbiCoder()

  const data = {
    metadataIpfsHash: metadataIpfsHash || '',
    feePercent: (keysManagerFee || 0) * 100,
    capacity: capacity || MaxUint256,
    symbol: vaultToken?.symbol,
    name: vaultToken?.name,
  }

  let encodedParams: GetTupleInput = []

  if (isMetaVault) {
    encodedParams.push({
      type: 'curator',
      // https://docs.stakewise.io/contracts/networks/Mainnet
      value: '0xD30E7e4bDbd396cfBe72Ad2f4856769C54eA6b0b',
    })
  }

  encodedParams.push(
    {
      type: 'capacity',
      value: data.capacity,
    },
    {
      type: 'feePercent',
      value: data.feePercent,
    }
  )

  if (vaultToken) {
    encodedParams.push(
      {
        type: 'tokenName',
        value: data.name,
      },
      {
        type: 'tokenSymbol',
        value: data.symbol,
      }
    )
  }

  encodedParams.push({
    type: 'metadata',
    value: data.metadataIpfsHash,
  })

  const { types, params } = _getTuple(encodedParams)

  return defaultAbiCoder.encode(types, params)
}


export default getEncodeBytes
