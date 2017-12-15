#!/usr/bin/env node
const cli = require('commander');
const chalk = require('chalk');
const Progress = require('progress');
const mkdir = require('mkdirp');
const nut = cli.arguments('<nut>');
const fs = require('fs');
const path = require('path');
const concat = require('concat');
const glob = require("glob");
nut
  .command('install [comp]')
  .action((comp) => {
      console.log('asdf');
    }
  )
;

const appicon = (file) => {
  'use strict';
};

const Fontmin = require('fontmin');
const webfont = (src, dest) => {
  'use strict';

  dest = ('app/prod/resource/font/' + dest).replace(/\/\//g, '/');

  let fontmin = new Fontmin()
    .src(src)
    .dest(dest);

  fontmin.run(function (err, files) {
    if (err) throw err;
    glob(dest + '/*.css', null, (err, arr) => {
      if (err) throw err;
      concat(arr, dest + '/base.css');
    });

    console.log('generate webfont : ' + dest);
  });
};

nut
  .command('generate [type] [file] [dest]')
  .action((type, file, dest) => {
      if (type === 'webfont') {
        webfont(file, dest);
      } else if (type === 'appicon') {
        appicon(file, dest);
      }
    }
  )
;

nut
  .command('page [location]')
  .action((location) => {
      'use strict';
      const prefix = 'app/dev/page/';
      const extension = '.html';
      location = (prefix + location + extension).replace('.html.html', '.html');

      let directory = location.split('/');
      const file = directory.splice(-1, 1).join('');
      directory = directory.join('/');

      mkdir(directory, (err) => {
        'use strict';
        if (err) {
          console.error(err);
        } else {
          let page = fs.readFileSync(path.resolve(__dirname, '../template/page/base.html'), 'utf-8');
          fs.writeFile(location, page, 'utf-8', () => {
            console.log('create page : ' + location);
          });
        }
      });
    }
  )
;

nut
  .command('layout [comp]')
  .action((comp) => {
      console.log('layout');
    }
  )
;

nut
  .command('create [comp]')
  .action((comp) => {
      'use strict';
      const template = path.resolve(__dirname, '../template/nut/');
      let directory = 'app/dev/nut/' + comp + '/';
      mkdir(directory, (err) => {
        'use strict';
        if (err) {
          console.error(err);
        } else {
          fs.readdir(template, (err, files) => {
            files.forEach(file => {
              'use strict';
              let content = fs.readFileSync(template + '/' + file, 'utf-8');
              content = content.replace(/{{comp}}/g, comp);
              let location = directory + file;
              fs.writeFile(location, content, 'utf-8', () => {
                console.log('create nut : ' + location);
              });
            });
          })
        }
      });
    }
  )
;

nut.parse(process.argv);
module.exports = this;
