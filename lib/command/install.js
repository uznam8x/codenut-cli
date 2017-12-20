const cli = require('commander');
const nut = cli.arguments('<nut>');
const mkdir = require('mkdirp');
const rmdir = require('rmdir');
const request = require('request');
const extract = require('extract-zip');
const path = require('path');
const fs = require('fs');

// # INSTALL
const remote = 'http://api.codenut.local.com';

const download = (data) => {
  'use strict';

  const file = data.url;
  const name = data.name;
  const type = data.type;
  const base = 'app';
  const output = {
    nut: base + '/dev/nut/' + name + '/',
    font: base + '/prod/resource/font/' + name + '/',
  };

  mkdir('temporary', (err) => {
    if (err) {
      console.error(err);
    } else {
      let stream = fs.createWriteStream('temporary/' + file);
      request(remote + '/download?file=' + file)
        .on('response', (response) => {
          //console.log(parseInt(response.headers['content-length'], 10));
        })
        .on('data', (chunk) => {
          //console.log(chunk.length);
          stream.write(chunk);
        })
        .on('end', () => {
          stream.end();
          const location = path.resolve('.') + '/';
          const dir = location + output[type];
          extract('./temporary/' + file, { dir: dir }, function (err) {
            if (err) throw err;
            fs.unlink('./temporary/' + file);
            rmdir('./temporary');
            console.log('asset installed : ' + dir);
          });
        });
    }
  });
};

nut
  .command('install [asset]')
  .action((asset) => {
      request({
        url: remote + '/asset',
        method: 'post',
        body: { name: asset },
        json: true,
      }, (err, response, body) => {
        'use strict';
        if (body.code === 200) {
          download(body.data);
        } else if (body.code === 401) {
          // Todo auth;

        } else {
          console.log('Not found asset');
        }
      });

      /*
        co(function* () {
            'use strict';
            const user = yield prompt('user : ');
            const password = yield prompt('pasword : ');
            console.log(user, password);
            process.exit(0);
          }
        )
        */
    }
  )
;