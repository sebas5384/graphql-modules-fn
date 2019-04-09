import pkg from './package.json'
import babel from 'rollup-plugin-babel'

export default [
  {
    input: 'src/index.js',
    external: [],
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
]
