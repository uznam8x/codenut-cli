const cli = require('commander');
const nut = cli.arguments('<nut>');
const fs = require('fs');
const mkdir = require('mkdirp');
const path = require('path');

nut
  .command('create [comp]')
  .action((comp) => {
      'use strict';
      const template = path.resolve(__dirname, '../../template/nut/');
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
          });
        }
      });
    }
  )
;