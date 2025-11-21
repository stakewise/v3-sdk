import json from '@rollup/plugin-json'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from './package.json' with { type: 'json' }


const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        name: pkg.name,
        file: pkg.module,
        exports: 'named',
        sourcemap: true,
        format: 'es',
      },
      {
        name: pkg.name,
        file: pkg.main,
        sourcemap: true,
        format: 'cjs',
      },
    ],
    plugins: [
      // @ts-ignore: this plugin has types for old version of jest :(
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        noEmitOnError: true,
        tsconfig: './tsconfig.json',
        exclude: [
          'node_modules',
          '**/*.spec.ts',
          'website/**/*',
        ],
      }),
      json(),
      terser({
        format: {
          comments: (_, comment) => {
            const isDocsDescription = comment.value.includes('docs.stakewise.io')

            return isDocsDescription
          },
        },
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        sourcemap: false,
        format: 'es',
      },
    ],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
      }),
      del({
        hook: 'buildEnd',
        targets: [
          './dist/src',
          './dist/rollup*',
        ],
      }),
    ],
  },
]


export default config
