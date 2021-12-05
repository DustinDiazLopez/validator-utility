/* eslint-disable import/no-extraneous-dependencies */
import * as esbuild from 'esbuild';

const FILE = './src/validatorUtility.js';

const node: esbuild.BuildOptions  = {
  entryPoints: [FILE],
  bundle: true,
  outfile: './build/node/10.4/validatorUtility.js',
  platform: 'node',
  target: [ 'node10.4' ],
};

esbuild.build(node).then(() => {
  console.log('Finished building node');
}).catch(() => process.exit(1));
