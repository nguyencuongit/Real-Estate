const path = require('node:path');
const root = path.resolve(__dirname, '..');
const modules = process.env.CONSTRUCTION_NODE_MODULES || path.resolve(root, '../../../node_modules');
require(path.join(modules, 'esbuild')).buildSync({
  entryPoints: [path.join(root, 'src/building.js')],
  nodePaths: [modules], bundle: true, minify: true, format: 'iife',
  target: ['es2020'], legalComments: 'linked',
  outfile: path.join(root, 'public/assets/building.min.js'),
});
console.log('Built TG Thang building viewer');
require(path.join(modules, 'esbuild')).buildSync({
  entryPoints: [path.join(root, 'src/motion.js')],
  bundle: true, minify: true, format: 'iife', target: ['es2020'],
  outfile: path.join(root, 'public/motion.js'),
});
console.log('Built TG Thang scroll effects');
