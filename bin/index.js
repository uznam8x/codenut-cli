#!/usr/bin/env node
const cli = require('commander');
const chalk = require('chalk');
const Progress = require('progress');
const mkdir = require('mkdirp');
const nut = cli.arguments('<nut>');
const fs = require('fs');
const path = require('path');
nut
  .command('install [comp]')
  .action((comp) => {
      console.log('asdf');
    }
  )
;

nut
  .command('generate [type] [file]')
  .action((type) => {

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
                console.log('create file : ' + location);
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