const mix = require('laravel-mix')
const path = require('path')

const directory = path.basename(path.resolve(__dirname))
mix.copyDirectory(`platform/themes/${directory}/public`, `public/themes/${directory}`)
