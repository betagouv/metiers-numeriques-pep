/* eslint-disable import/no-default-export */

import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

/**
 * @param {string} path
 *
 * @returns {import('rollup').RollupOptions}
 */
const getConfigFromPath = path => ({
  external: ['@prisma/client', 'bull', 'jest-worker', 'jsdom', 'sanitize-html', 'redis', 'turndown'],

  input: `./src/${path}.ts`,

  output: {
    file: `./build/${path}.cjs`,
    format: 'cjs',
    // intro: [`const navigator = {};`].join('\n'),
  },

  plugins: [
    nodeResolve({
      extensions: ['.cjs', '.js', '.json', '.mjs', '.node'],
      // ignoreSideEffectsForRoot: true,
      preferBuiltins: true,
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
})

export default ['jobs/indexNewPepOffers', 'jobs/processNewPepOffer', 'worker'].map(getConfigFromPath)
