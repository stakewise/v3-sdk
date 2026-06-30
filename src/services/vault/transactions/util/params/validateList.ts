import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../../helpers'


type ListItem = {
  address: string
  isNew: boolean
}

const validateList = (values: Record<string, ListItem[]>) => {
  Object.keys(values).forEach((key) => {
    parseArgs(z.object({ [key]: schema.array() }), { [key]: values[key] })

    const isValid = values[key].every((listItem) => (
      listItem
      && typeof listItem === 'object'
      && typeof listItem.address === 'string'
      && typeof listItem.isNew === 'boolean'
    ))

    if (!isValid) {
      throw new Error(`The "${key}" argument must be an array of objects with "address" and "isNew" keys`)
    }
  })
}


export default validateList
