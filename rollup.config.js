import { createBasicConfig } from '@open-wc/building-rollup'
import typescript from '@rollup/plugin-typescript'

let baseConfig = createBasicConfig()
delete baseConfig.output.dir
delete baseConfig.output.name
delete baseConfig.output.format

export default {
  input: 'build/src/main.js',
  output: {
    file: 'docs/app.js',
    format: 'iife',
    name: 'app',
  },
  plugins: [
    typescript({
      lib: ['es5', 'es6', 'dom'],
      target: 'es5',
      allowSyntheticDefaultImports: true,
    }),
  ],
}
