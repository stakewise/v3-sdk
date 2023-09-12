import path from 'path'
import json from '@rollup/plugin-json'
import { dts } from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import packageJson from './package.json'


const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        inlineDynamicImports: true,
        file: packageJson.main,
        sourcemap: true,
        format: 'cjs',
      },
    ],
    resolve: {
      alias: {
        'graphql': path.resolve(__dirname, 'src/graphql'),
        'helpers': path.resolve(__dirname, 'src/helpers')
      },
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        noEmitOnError: true,
        tsconfig: './tsconfig.json',
        exclude: [
          '**/*.spec.ts',
          '**/*.stories.tsx',
        ],
      }),
      json(),
      terser(),
    ],
  },
  {
    input: 'dist/index.js',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'cjs',
      },
    ],
    plugins: [
      dts(),
    ],
  }
]


export default config
