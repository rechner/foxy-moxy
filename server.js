try {
  const newrelic = require('newrelic');
} catch (e) {
  console.error("WARNING unable to load newrelic")
}

const express = require('express');
const cluster = require('express-cluster');
const uuid = require('uuid/v4');
const sanitize = require('sanitize-filename');
const Canvas = require('canvas');

const Fox = require('./js/fox.js');
const renderFox = require('./js/render-fox.js');

function composeImage(width, height, seed) {
    seed = seed || uuid();
    const fox = Fox(width, height, seed);
    const canvas = new Canvas(width, height);
    renderFox(canvas, fox);
    return canvas;
};

const cacheTimeout = 60 * 60 * 24 * 30;

cluster((worker) => {
    const app = express();

    app.get('/healthcheck', (req, res) => {
        res.status(200).end();
    });

    app.get('/:width/:seed', (req, res) => {
        let width = parseInt(req.params.width) || 400;
        if (width > 400) width = 400;
        const seed = sanitize(req.params.seed) || uuid();
        const canvas = composeImage(width, width, seed);
        const buffer = canvas.toBuffer();
        res.set('Cache-Control', 'max-age=' + cacheTimeout);
        res.set('Content-length', buffer.length);
        res.type('png');
        res.end(buffer, 'binary');
    });

    activePort = process.env.PORT || 3000;
    app.listen(activePort, () => {
        console.log('worker ' + worker.id + ' is listening on port ' + activePort);
    });
})
