import copy from 'rollup-plugin-copy'
import json from '@rollup/plugin-json'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'
import type { RollupOptions } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from './package.json'


const config: RollupOptions[] = [
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
        ],
      }),
      json(),
      terser({
        format: {
          comments: false,
        },
      }),
      copy({
        targets: [
          { src: 'src/contracts/abis', dest: 'dist' },
        ],
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
  {
    input: 'dist/abis/index.js',
    output: [
      {
        file: 'dist/abis/index.d.ts',
        sourcemap: false,
        format: 'es',
      },
    ],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
      }),
      json(),
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
