const express = require('express')
const { v4: uuidv4 } = require('uuid')
const sanitize = require('sanitize-filename')
const Canvas = require('canvas')
const Sentry = require('@sentry/node');
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
  const etag = `W/${seed}`
  const contentType = 'image/png'

  res.set('Cache-Control', 'public; max-age=' + cacheTimeout)
  res.set('Content-Type', contentType)
  res.set('Etag', etag)

  if (req.headers['if-none-match'] === etag) {
      res.status(304).end('')
      return
  }

  const canvas = composeImage(width, width, seed, version)
  const buffer = canvas.toBuffer(contentType)
  res.set('Content-Length', buffer.length)
  res.end(buffer, 'binary')
}

const cacheTimeout = 60 * 60 * 24 * 30
const app = express()
if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN })
}

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler())

app.get('/healthcheck', (req, res) => {
  res.status(200).end()
})

app.get('/:width/:seed', (req, res) => {
  getFox(req, res)
})

app.get('/2/:width/:seed', (req, res) => {
  getFox(req, res)
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

module.exports = app
