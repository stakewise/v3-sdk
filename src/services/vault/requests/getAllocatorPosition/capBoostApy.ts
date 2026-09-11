type CapBoostApyInput = {
  apy: number
  vaultApy: number
  allocatorMaxBoostApy: number
  hasExtraBoostShares?: boolean
}

const anomalyTolerance = 1.1

const capBoostApy = (values: CapBoostApyInput): number => {
  const { apy, vaultApy, allocatorMaxBoostApy, hasExtraBoostShares } = values

  if (hasExtraBoostShares) {
    return apy
  }

  if (!allocatorMaxBoostApy || allocatorMaxBoostApy <= vaultApy) {
    return apy
  }

  if (apy > allocatorMaxBoostApy * anomalyTolerance) {
    return allocatorMaxBoostApy
  }

  return apy
}


export default capBoostApy
