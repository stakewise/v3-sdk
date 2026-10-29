import type { SubgraphErrorPolicy } from '../types'


const argument = 'subgraphError: allow'
const nameRegExp = /[_A-Za-z]/
const nameCharRegExp = /[_0-9A-Za-z]/

// _meta and __typename don't accept subgraphError
const skipFieldRegExp = /^_meta$|^__/

const cache = new Map<string, string>()

const skipSpaces = (query: string, index: number) => {
  let result = index

  while (result < query.length && /[\s,]/.test(query[result])) {
    result += 1
  }

  return result
}

const readName = (query: string, index: number) => {
  let end = index

  while (end < query.length && nameCharRegExp.test(query[end])) {
    end += 1
  }

  return { name: query.slice(index, end), end }
}

const skipString = (query: string, index: number) => {
  let result = index + 1

  while (result < query.length && query[result] !== '"') {
    result += query[result] === '\\' ? 2 : 1
  }

  return result + 1
}

// Adds "subgraphError: allow" to every root field of the first operation in the query
const addArgument = (query: string) => {
  const inserts: Array<{ index: number, value: string }> = []

  let index = 0
  let braceDepth = 0
  let parenDepth = 0
  let isStarted = false

  while (index < query.length) {
    const char = query[index]

    if (char === '"') {
      index = skipString(query, index)
      continue
    }

    if (char === '(') {
      parenDepth += 1
    }
    else if (char === ')') {
      parenDepth -= 1
    }
    // Braces inside arguments are input objects, they don't change the selection depth
    else if (char === '{' && !parenDepth) {
      braceDepth += 1
      isStarted = true
    }
    else if (char === '}' && !parenDepth) {
      braceDepth -= 1

      if (isStarted && !braceDepth) {
        break
      }
    }
    else if (char === '.' || char === '@') {
      // Skip fragment spreads (...Name, ... on Type) and directives (@include)
      while (query[index] === '.' || query[index] === '@') {
        index += 1
      }

      const spread = readName(query, skipSpaces(query, index))

      index = spread.name === 'on'
        ? readName(query, skipSpaces(query, spread.end)).end
        : spread.end

      continue
    }
    else if (braceDepth === 1 && !parenDepth && nameRegExp.test(char)) {
      let { name, end } = readName(query, index)
      let nextIndex = skipSpaces(query, end)

      // Alias: "alias: field"
      if (query[nextIndex] === ':') {
        const field = readName(query, skipSpaces(query, nextIndex + 1))

        name = field.name
        end = field.end
        nextIndex = skipSpaces(query, end)
      }

      if (!skipFieldRegExp.test(name)) {
        inserts.push(
          query[nextIndex] === '('
            ? { index: nextIndex + 1, value: `${argument}, ` }
            : { index: end, value: `(${argument})` }
        )
      }

      index = end
      continue
    }

    index += 1
  }

  return inserts.reduceRight((result, { index, value }) => (
    `${result.slice(0, index)}${value}${result.slice(index)}`
  ), query)
}

const applySubgraphErrorPolicy = (query: string, subgraphError?: SubgraphErrorPolicy) => {
  // "deny" is the subgraph default, nothing to change
  if (subgraphError !== 'allow' || /subgraphError\s*:/.test(query)) {
    return query
  }

  let result = cache.get(query)

  if (!result) {
    result = addArgument(query)
    cache.set(query, result)
  }

  return result
}


export default applySubgraphErrorPolicy
