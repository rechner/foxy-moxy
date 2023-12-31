const renderFox = function (canvas, opts) {
  const width = opts.canvas.width
  const height = opts.canvas.height
  const ctx = canvas.getContext('2d', {
    pixelFormat: 'RGB16_565',
  })

  ctx.fillStyle = opts.canvas.color
  ctx.fillRect(0, 0, width, height)
  renderEars(ctx, opts.ears)
  renderHead(ctx, opts.head)
  renderEyes(ctx, opts.eyes)
  renderNose(ctx, opts.nose)
  renderMouth(ctx, opts.mouth)

  shiftCanvas(ctx, width, height, 0, 0.06 * height)
}

function shiftCanvas (ctx, w, h, dx, dy) {
  const topImage = ctx.getImageData(0, 0, w, h)
  const bottomImage = ctx.getImageData(0, h - dy, w, h)

  ctx.clearRect(0, 0, w, h)
  ctx.putImageData(bottomImage, 0, 0)
  ctx.putImageData(topImage, dx, dy)
}

function renderHead (ctx, opts) {
  ctx.save()
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
  ctx.rotate(Math.PI / 4)
  drawEllipseByCenter(ctx, 0, 0, opts.width, opts.height, opts.color, null, opts.kappa)
  ctx.restore()
  ctx.clip()
  drawEllipseByCenter(ctx, ctx.canvas.width / 2, ctx.canvas.height, opts.mask.width, opts.mask.height, '#fff', '#fff', 0.5)
}

function renderEars (ctx, opts) {
  const offset = {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2
  }
  ctx.save()
  ctx.translate(offset.x, offset.y)
  ctx.rotate(-opts.left.angle)
  drawEllipseByCenter(ctx, opts.left.x - offset.x, opts.left.y - offset.y, opts.left.width, opts.left.height, opts.color, null, opts.kappa)
  ctx.restore()

  ctx.save()
  ctx.translate(offset.x, offset.y)
  ctx.rotate(-opts.right.angle)
  drawEllipseByCenter(ctx, opts.right.x - offset.x, opts.right.y - offset.y, opts.right.width, opts.right.height, opts.color, null, opts.kappa)
  ctx.restore()
}

function renderEyes (ctx, opts) {
  switch (opts.style) {
    case 'ellipse':
      drawEllipseByCenter(ctx, opts.left.x, opts.left.y, opts.width, opts.height, 'black', null, 0.5)
      drawEllipseByCenter(ctx, opts.right.x, opts.right.y, opts.width, opts.height, 'black', null, 0.5)
      break
    case 'smiley':
      ctx.strokeStyle = 'black'
      ctx.beginPath()
      ctx.moveTo(opts.left.x - opts.width, opts.left.y + opts.height)
      ctx.bezierCurveTo(opts.left.x - opts.width, opts.left.y + opts.height, opts.left.x, opts.left.y, opts.left.x + opts.width, opts.left.y + opts.height)
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.moveTo(opts.right.x - opts.width, opts.right.y + opts.height)
      ctx.bezierCurveTo(opts.right.x - opts.width, opts.right.y + opts.height, opts.right.x, opts.right.y, opts.right.x + opts.width, opts.right.y + opts.height)
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.closePath()
      break
    case 'none':
      break
  }
}

function renderNose (ctx, opts) {
  ctx.strokeStyle = 'black'
  ctx.beginPath()
  ctx.moveTo(opts.x - opts.width / 2, opts.y - opts.height / 2)
  ctx.bezierCurveTo(opts.x - opts.width / 2, opts.y - opts.height / 2, opts.x, opts.y - opts.height, opts.x + opts.width / 2, opts.y - opts.height / 2)
  ctx.bezierCurveTo(opts.x + opts.width / 2, opts.y - opts.height / 2, opts.x + opts.width / 2, opts.y + opts.height / 2, opts.x, opts.y + opts.height / 2)
  ctx.bezierCurveTo(opts.x, opts.y + opts.height / 2, opts.x - opts.width / 2, opts.y + opts.height / 2, opts.x - opts.width / 2, opts.y - opts.height / 2)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.stroke()
}

function renderMouth (ctx, opts) {
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 0.01 * ctx.canvas.width
  ctx.beginPath()
  switch (opts.style) {
    case 'smirk':
      ctx.moveTo(opts.x - opts.width / 2, opts.y - opts.height / 2)
      ctx.bezierCurveTo(opts.x - opts.width / 2, opts.y - opts.height / 2,
        opts.x - opts.width / 2, opts.y + opts.height / 2,
        opts.x + opts.width / 2, opts.y
      )
      break
    case 'cat':
      ctx.moveTo(opts.x - opts.width / 2, opts.y + opts.height / 2)
      ctx.bezierCurveTo(opts.x - opts.width / 2, opts.y + opts.height / 2,
        opts.x, opts.y + opts.height / 2,
        opts.x, opts.y - opts.height / 2
      )
      ctx.bezierCurveTo(
        opts.x, opts.y - opts.height / 2,
        opts.x, opts.y + opts.height / 2,
        opts.x + opts.width / 2, opts.y + opts.height / 2
      )
      break
  }
  ctx.stroke()
}

function drawEllipseByCenter (ctx, cx, cy, w, h, color, fillColor, kappa) {
  drawEllipse(ctx, cx - w / 2.0, cy - h / 2.0, w, h, color, fillColor, kappa)
}

function drawEllipse (ctx, x, y, w, h, color, fillColor, kappa = 0.3) {
  const ox = (w / 2) * kappa // control point offset horizontal
  const oy = (h / 2) * kappa // control point offset vertical
  const xe = x + w           // x-end
  const ye = y + h           // y-end
  const xm = x + w / 2       // x-middle
  const ym = y + h / 2       // y-middle

  if (color) {
    ctx.strokeStyle = color
  }
  ctx.beginPath()
  ctx.moveTo(x, ym)
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y)
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym)
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym)
  fillColor = fillColor || color
  if (fillColor) {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
  ctx.stroke()
}

module.exports = renderFox
