const path = require('node:path');
const root = path.resolve(__dirname, '..');
const modules = process.env.VANTA_NODE_MODULES || path.resolve(root, '../../../node_modules');
const esbuild = require(path.join(modules, 'esbuild'));

esbuild.buildSync({
  entryPoints: [path.join(root, 'src/vehicle-3d.js')],
  nodePaths: [modules],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  legalComments: 'linked',
  outfile: path.join(root, 'public/assets/vehicle-3d.min.js'),
});
console.log('Built public/assets/vehicle-3d.min.js');
