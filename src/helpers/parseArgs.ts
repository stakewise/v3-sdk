import * as z from 'zod/mini'


const parseArgs = <Schema extends z.ZodMiniType>(schema: Schema, input: unknown): z.infer<Schema> => {
  const result = schema.safeParse(input)

  if (!result.success) {
    const { path, message } = result.error.issues[0]

    throw new Error(path.length ? `The "${path.join('.')}" argument ${message}` : message)
  }

  return result.data
}


export default parseArgs
