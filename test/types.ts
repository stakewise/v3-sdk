export type VariablesCase<Input> = {
  name: string
  input: Partial<Input>
  expected: Record<string, unknown>
}
