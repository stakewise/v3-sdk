const divideRoundingUp = (numerator: bigint, denominator: bigint) => (
  (numerator + denominator - 1n) / denominator
)


export default divideRoundingUp
