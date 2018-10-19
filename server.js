const express = require('express')
const connectDatadog = require('connect-datadog')
const uuid = require('uuid/v4')
const sanitize = require('sanitize-filename')
const Canvas = require('canvas')

const Fox = require('./js/fox.js')
const renderFox = require('./js/render-fox.js')

function composeImage (width, height, seed, version) {
  seed = seed || uuid()
  const fox = Fox(width, height, seed)
  const canvas = Canvas.createCanvas(width, height)
  renderFox(canvas, fox)
  return canvas
}

function getFox (req, res, version) {
  let width = parseInt(req.params.width) || 400
  if (width > 400) width = 400
  const seed = sanitize(req.params.seed) || uuid()
  const canvas = composeImage(width, width, seed, version)
  const buffer = canvas.toBuffer('image/png')
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
  getFox(req, res)
})

app.get('/2/:width/:seed', (req, res) => {
  getFox(req, res)
})

module.exports = app
