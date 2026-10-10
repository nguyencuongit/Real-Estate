const mix = require('laravel-mix')
const path = require('path')

const directory = path.basename(path.resolve(__dirname))
const source = `platform/themes/${directory}`
const dist = `public/themes/${directory}`

// The demo ships ready-to-use CSS, scripts and images in public.
mix.copyDirectory(`${source}/public`, dist)
