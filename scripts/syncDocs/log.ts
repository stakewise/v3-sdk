export default {
  info: (message: string) => console.log(`\x1b[36m${message}\x1b[0m\n`),
  error: (message: string) => console.log(`\x1b[31m❌ ${message}\x1b[0m\n`),
  success: (message: string) => console.log(`\x1b[32m✅ ${message}\x1b[0m\n`),
}
