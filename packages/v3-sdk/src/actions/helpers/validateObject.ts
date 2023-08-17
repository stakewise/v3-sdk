const validateObject = (object: unknown): object is Record<string, any> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Object is required')
  }

  return true
}


export default validateObject
