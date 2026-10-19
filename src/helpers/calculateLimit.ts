const millisecondsInDay = 1000 * 60 * 60 * 24

const calculateLimit = (dateTo: number, dateFrom: number): number => {
  if (dateFrom > dateTo) {
    throw new Error('The "dateFrom" argument must be less than or equal to "dateTo"')
  }

  return Math.ceil((dateTo - dateFrom) / millisecondsInDay)
}


export default calculateLimit
