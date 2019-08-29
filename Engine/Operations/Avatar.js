'use strict';

const fs        = require('fs');
const path      = require('path');

const download  = require('download');
const urlExists = require('url-exists');

const utils     = require('./Utils');

const Promise   = require('bluebird');
const Image     = require('./Image');

const Base = require('../../Configuration');

class Avatar extends Base{
  constructor(request, response, database) {
    super();
    this.response = response;
    this.request = request;
    this.database = database;
    this.cachePath = path.join(__dirname, '..', 'Cache');
    this.cacheSource = 'https://icer.ink/mobcdn.clubpenguin.com/game/items/images/paper/image/';


    this.size = this.validateSize(120);
    this.build();
  }

  async execute(){
    let img = await this.build();
    this.user = await this.database.execute('penguin', `findOne`, {where: {ID: `${this.request.params.value}`}});
    this.response.set('Content-Type', 'image/png');
    this.response.set('Content-Length', img.length);
    this.response.end(img);
  }

  async validate() {
    this.user = await this.database.execute('penguin', `findOne`, {where: {ID: `${this.request.params.value}`}});

    let penguin = {
      "photo": this.user.Photo,
      "color": this.user.Color,
      "feet": this.user.Feet,
      "body": this.user.Body,
      "hand": this.user.Hand,
      "face": this.user.Face,
      "head": this.user.Head,
      "neck": this.user.Neck,
      "flag": this.user.Flag
    };

    for(var i in penguin) {
      const item = penguin[i];

      if(!item || isNaN(item)) {
        if(i != 'color') {
          penguin[i] = null;
          delete penguin[i];
        } else
          penguin[i] = 1;
      }
    }

    const colors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    if(!penguin['color'] || !colors.includes(penguin['color']))
      penguin['color'] = 1;

    return penguin;
  }

  validateSize(size) {
    const sizes = [60, 88, 95, 120, 300, 600];

    if(!size || isNaN(size))
      size = 120;
    if(!sizes.includes(size))
      size = utils.nearest(size, sizes);

    return size;
  }

  getArray() {
    const items = Object.values(this.penguin);

    if(items.length == 0)
      items.push(1);

    return items;
  }

  remove(myItem) {
    for(var i in this.penguin) {
      const item = this.penguin[i];

      if(myItem == item) {
        this.penguin[i] = null;
        delete this.penguin[i];
      }
    }
  }

  async build() {
    this.penguin = await this.validate();
    return new Promise((resolve, reject) => {
      this.checkCache().then(async () => {
        for(var i in this.penguin) {
          const item = this.penguin[i];

          const itemFile = item + '.png';
          const itemPath = path.join(this.cachePath, 'paper', 'image', String(this.size), itemFile);

          if(!this.image)
            this.image = new Image(this.size);

          await this.image.draw(itemPath, 0, 0);
        }

        if(this.image) {
          const buff = this.image.encode('png');

          resolve(buff);
        } else
          reject('Unable to render avatar.');
      });
    });
  }

  checkCache() {
    return new Promise((resolve, reject) => {
      const items = this.getArray();

      Promise.all(
        items.map(this.checkItemCache.bind(this))
      )
      .then(resolve)
      .catch(reject);
    });
  }

  checkItemCache(item) {
    return new Promise((resolve, reject) => {
      const size = this.size;

      const itemFile = item + '.png';
      const itemPath = path.join(this.cachePath, 'paper', 'image', String(size), itemFile);

      fs.stat(itemPath, (err, stat) => {
        if(!err)
          resolve();
        else if(err.code == 'ENOENT') {
          const itemURL = this.cacheSource + '/' + String(size) + '/' + itemFile;

          urlExists(itemURL, (e, exists) => {
            if(exists) {
              download(itemURL, itemPath.replace(itemFile, '')).then(() => {
                resolve();
              });
            } else {
              if(e)
                this.log.crash(e);

              this.remove(item);
              resolve();
            }
          })
        } else {
          this.log.crash(err);
          this.remove(item);

          resolve();
        }
      })
    });
  }
}

module.exports = Avatar;