const express = require('express')
const connectDatadog = require('connect-datadog')
const uuid = require('uuid/v4')
const sanitize = require('sanitize-filename')
const Canvas = require('canvas')

const Fox = require('./js/fox.js')
const FoxAmerica = require('./js/fox-america.js')
const renderFox = require('./js/render-fox.js')

function composeImage (width, height, seed, version) {
  seed = seed || uuid()
  let fox
  switch (version) {
    case 2:
      // America-color bg and fox
      fox = FoxAmerica(width, height, seed)
      break
    default:
      // original fox
      fox = Fox(width, height, seed)
  }
  const canvas = new Canvas(width, height)
  renderFox(canvas, fox)
  return canvas
}

function getFox (req, res, version) {
  let width = parseInt(req.params.width) || 400
  if (width > 400) width = 400
  const seed = sanitize(req.params.seed) || uuid()
  const canvas = composeImage(width, width, seed, version)
  const buffer = canvas.toBuffer()
  res.set('Cache-Control', 'max-age=' + cacheTimeout)
  res.set('Content-length', buffer.length)
  res.type('png')
  res.end(buffer, 'binary')
}

const cacheTimeout = 60 * 60 * 24 * 30
const app = express()
app.use(connectDatadog({stat: 'foxy-moxy'}))

app.get('/healthcheck', (req, res) => {
  res.status(200).end()
})

app.get('/:width/:seed', (req, res) => {
  getFox(req, res, 1)
})

app.get('/2/:width/:seed', (req, res) => {
  getFox(req, res, 2)
})

module.exports = app
