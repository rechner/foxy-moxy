const describe = require('mocha').describe
const it = require('mocha').it
const request = require('supertest')
const assert = require('assert')
const sharp = require('sharp')

const app = require('../server')

const testUID = 4125370

describe('Foxy-moxy v1', () => {
  describe('fox generation', () => {
    it('should respect widths < 400', (done) => {
      const width = 158
      request(app)
                .get(`/${width}/${testUID}`)
                .expect('Content-Type', 'image/png')
                .expect(200)
                .end(function (err, res) {
                  assert(!err, String(err))
                  sharp(res.body).metadata((err, metadata) => {
                    assert(!err, String(err))
                    assert.equal(metadata.format, 'png')
                    assert.equal(metadata.height, width)
                    assert.equal(metadata.width, width)
                    done()
                  })
                })
    })

    it('should allow max width of 400', (done) => {
      const width = 510
      request(app)
                .get(`/${width}/${testUID}`)
                .expect('Content-Type', 'image/png')
                .expect(200)
                .end(function (err, res) {
                  assert(!err, String(err))
                  sharp(res.body).metadata((err, metadata) => {
                    assert(!err, String(err))
                    assert.equal(metadata.format, 'png')
                    assert.equal(metadata.height, 400)
                    assert.equal(metadata.width, 400)
                    done()
                  })
                })
    })
  })
})

describe('Foxy-moxy v2', () => {
  describe('fox generation', () => {
    it('should give 304 when presented with correct etag', (done) = async function () {
      const uncachedResponse = await request(app)
        .get(`/2/400/${testUID}`)
        .expect('Content-Type', 'image/png')
        .expect(200)

      const cachedResponse = await request(app)
        .get(`/2/400/${testUID}`)
        .set('If-None-Match', uncachedResponse.headers.etag)
        .expect('Content-Type', 'image/png')
        .expect(304)

      done()
    })

    it('should respect widths < 400', (done) => {
      const width = 158
      request(app)
                .get(`/2/${width}/${testUID}`)
                .expect('Content-Type', 'image/png')
                .expect(200)
                .end(function (err, res) {
                  assert(!err, String(err))
                  sharp(res.body).metadata((err, metadata) => {
                    assert(!err, String(err))
                    assert.equal(metadata.format, 'png')
                    assert.equal(metadata.height, width)
                    assert.equal(metadata.width, width)
                    done()
                  })
                })
    })

    it('should allow max width of 400', (done) => {
      const width = 510
      request(app)
                .get(`/2/${width}/${testUID}`)
                .expect('Content-Type', 'image/png')
                .expect(200)
                .end(function (err, res) {
                  assert(!err, String(err))
                  sharp(res.body).metadata((err, metadata) => {
                    assert(!err, String(err))
                    assert.equal(metadata.format, 'png')
                    assert.equal(metadata.height, 400)
                    assert.equal(metadata.width, 400)
                    done()
                  })
                })
    })
  })
})
