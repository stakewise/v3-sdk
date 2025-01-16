const getTimestamp = (days: number) => {
  const currentDate = new Date()
  const pastDate = new Date(currentDate)

  pastDate.setDate(currentDate.getDate() - days)
  pastDate.setHours(0, 0, 0, 0)

  return pastDate.getTime() * 1000
}


export default getTimestamp
