import globals from 'globals'
import jsPkg from '@eslint/js'
import jestPlugin from 'eslint-plugin-jest'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'


const { configs: jsConfigs } = jsPkg
const jsRecommended = jsConfigs.recommended

const { configs: tsConfigs } = tsPlugin
const tsRecommended = tsConfigs.recommended

const importErrors = importPlugin.configs.errors
const importWarnings = importPlugin.configs.warnings
const importTypescript = importPlugin.configs.typescript

const jestConfigs = jestPlugin.configs
const jestRecommended = jestConfigs.recommended
const jestGlobals = jestPlugin.environments.globals


export default defineConfig([
  globalIgnores([
    'hardhat.config.js',
    "**/*.graphql.ts",
    '**/types/*.ts',
    '**/*.d.ts',
    'scripts/*',
    'dist/*',
  ]),
  {
    files: [
      '**/*.{js,ts,jsx,tsx}',
    ],
    languageOptions: {
      globals: {
        ...jestGlobals.globals,
        ...globals.browser,
        ...globals.mocha,
        ...globals.node,
        StakeWise: 'readonly',
      },
      parser: tsParser,
      parserOptions: {
        project:  './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      jest: jestPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project:  './tsconfig.json',
        }
      }
    },
    rules: {
      ...jsRecommended.rules,
      ...tsRecommended.rules,
      ...importErrors.rules,
      ...importWarnings.rules,
      ...jestRecommended.rules,
      ...importTypescript.rules,
      'no-trailing-spaces': 'warn',
      'semi': [
        'error',
        'never',
      ],
      'max-len': [
        'warn', { code: 140 }
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
        }
      ],
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      'object-curly-spacing': [
        'error',
        'always',
      ],
      'array-bracket-spacing': [
        'error',
        'always',
      ],
      'no-multiple-empty-lines': [
        'error', { max: 2 }
      ],
      'jsx-a11y/alt-text': 'off',
      'comma-dangle': [
        'warn',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        }
      ],
      'import/named': 'off',
      'import/first': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/no-dynamic-require': 'off',
      'import/prefer-default-export': 'off',
      'import/no-webpack-loader-syntax': 'off',
      'import/no-named-as-default-member': 'warn',
      'import/no-extraneous-dependencies': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/newline-after-import': [
        'error', { count: 2 },
      ]
    }
  }
])
