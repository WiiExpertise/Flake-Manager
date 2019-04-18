'use strict';

const Canvas = require('canvas');

class Image {
  constructor(width, height, canvas) {
    if(width && !height)
      height = width;
    if(!canvas)
      canvas = Canvas.createCanvas(width, height)

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  async draw(img, x, y) {
    if(typeof img == 'string')
      img = await this.load(img);

    if(!x || isNaN(x))
      x = 0;
    if(!y || isNaN(y))
      y = 0;

    this.ctx.drawImage(img, x, y);
  }

  load(url) {
    return Canvas.loadImage(url);
  }

  encode(type) {
    if(!type)
      type = 'png';
    if(type.indexOf('/') == -1)
      type = 'image/' + type;

    return this.canvas.toBuffer(type)
  }

  stream(type, config) {
    if(!type)
      type = 'png';

    type = type.toLowerCase();

    if(type == 'jpg')
      type = 'jpeg';

    const types = ['png', 'jpeg', 'pdf'];

    if(!types.includes(type))
      return 'Invalid type.';

    return this.canvas['create' + type.toUpperCase() + 'Stream'](config);
  }
}

module.exports = Image;