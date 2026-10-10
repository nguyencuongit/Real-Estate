const path = require('path');
const esbuild = require(path.join(process.env.BEAUTY_NODE_MODULES || 'F:/revuelto-atelier-demo/node_modules', 'esbuild'));

esbuild.buildSync({
    entryPoints: [path.resolve(__dirname, '../src/motion.js')],
    outfile: path.resolve(__dirname, '../public/motion.js'),
    bundle: true,
    format: 'iife',
    target: ['es2020'],
    minify: false,
    legalComments: 'none',
});
console.log('Built beauty motion bundle');
