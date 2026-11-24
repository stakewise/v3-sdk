const getRetryAfterMs = (headers: Record<string, string>) => {
  const seconds = Number(headers['retry-after'])

  return seconds > 0 ? seconds * 1_000 : 0
}


export default getRetryAfterMs
