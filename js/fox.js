const Chance = require('chance');

const hsl = function (h, s, l) {
  return "hsl(" + h + "," + s + "%, " + l + "%)";
}

const Fox = function (IMG_WIDTH, IMG_HEIGHT, seed) {
  if (seed) {
    chance = new Chance(seed);
  } else {
    chance = new Chance();
  }

  // origin: head top left corner
  const kappa = chance.floating({min: 0.2, max: 0.45})

  const hue = chance.integer({min: 5, max: 50});
  const saturation = chance.integer({min: 70, max: 90});
  const lightness = chance.integer({min: 40, max: 60});

  const head = {
    width: 0.6 * IMG_WIDTH,
    height: 0.6 * IMG_HEIGHT,
    kappa: kappa,
    color: hsl(hue, saturation, lightness)
  }

  const origin = {x: IMG_WIDTH / 2 - head.width / 2, y: 0.5 * IMG_HEIGHT - head.height / 2};

  const ears = (function (origin, headWidth, headHeight, headColor) {
    const offsetX = chance.floating({min: 0.17 * headWidth, max: 0.2 * headWidth});
    const angle = chance.floating({min: 0.05 * Math.PI, max: 0.2 * Math.PI});
    return {
      color: headColor,
      kappa: 0.9 * kappa,
      left: {
        x: origin.x + (headWidth/2) - offsetX,
        y: origin.y + (0.15 * headHeight),
        angle: angle,
        width: 0.4 * headWidth,
        height: 0.8 * headHeight
      },
      right: {
        x: origin.x + (headWidth/2) + offsetX,
        y: origin.y + (0.15 * headHeight),
        angle: -angle,
        width: 0.4 * headWidth,
        height: 0.8 * headHeight
      }
    };
  }(origin, head.width, head.height, head.color));

  const eyes = (function (origin, headWidth, headHeight) {
    // TODO: color
    const offsetY = chance.floating({min: -0.05 * headHeight, max: -0.025 * headHeight});
    const offsetX = chance.floating({min: 0.13 * headWidth, max: 0.25 * headWidth});

    const eyeHeight = chance.floating({min: 0.08 * headHeight, max: 0.13 * headHeight});

    return {
      height: eyeHeight,
      width: eyeHeight/2,
      style: 'ellipse',
      // style: chance.pickone(['ellipse', 'smiley']),
      left: {
        x: origin.x + (headWidth/2) - offsetX,
        y: origin.y + (headHeight/2) + offsetY
      },
      right: {
        x: origin.x + (headWidth/2) + offsetX,
        y: origin.y + (headHeight/2) + offsetY
      }
    }
  }(origin, head.width, head.height));

  const nose = {
    x: origin.x + (head.width/2),
    y: (eyes.left.y + chance.floating({min: 0.2, max: 0.4}) * (origin.y + head.height - eyes.left.y)),
    width: chance.floating({min: 0.03, max: 0.04}) * head.width,
    height: chance.floating({min: 0.03, max: 0.04}) * head.width
  }

  const mouth = {
    x: origin.x + (head.width/2),
    y: (nose.y + chance.floating({min: 0.2, max: 0.35}) * (origin.y + head.height - nose.y)),
    width: chance.floating({min: 0.08, max: 0.15}) * head.width,
    height: chance.floating({min: 0.03, max: 0.06}) * head.width,
    style: chance.pickone(['smirk', 'cat', 'none'])
  }

  const mask = {
    width: chance.floating({min: 0.5 * IMG_WIDTH, max: IMG_WIDTH}),
    height: chance.floating({min: 1.7 * (IMG_HEIGHT - eyes.left.y), max: 1.85 * (IMG_HEIGHT - eyes.left.y)})
  }
  head.mask = mask;

  return {
    canvas: {
      height: IMG_HEIGHT,
      width: IMG_WIDTH,
      color: hsl(
        chance.integer({min:0, max:360}),
        chance.integer({min:0, max:100}),
        chance.integer({min:10, max:100})
      ),
    },
    head: head,
    ears: ears,
    eyes: eyes,
    nose: nose,
    mouth: mouth
  };
};

module.exports = Fox;
