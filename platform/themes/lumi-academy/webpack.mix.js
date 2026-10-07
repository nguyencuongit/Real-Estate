const mix = require('laravel-mix')
const path = require('path')

const directory = path.basename(path.resolve(__dirname))
const source = `platform/themes/${directory}`
const dist = `public/themes/${directory}`

// Keep the bundled Three.js scene and relative font URLs intact.
mix.copyDirectory(`${source}/public`, dist)
