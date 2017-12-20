const cli = require('commander');
const nut = cli.arguments('<nut>');
const mkdir = require('mkdirp');
const rmdir = require('rmdir');
const request = require('request');
const extract = require('extract-zip');
const path = require('path');
const fs = require('fs');
const async = require('async');
const co = require('co');
const prompt = require('co-prompt');
const _ = require('underscore');
const md5 = require('md5');

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

const getAsset = (asset, auth) => {
  'use strict';
  let option = {
    url: remote + '/asset',
    method: 'post',
    body: { name: asset },
    json: true,
  };

  if (auth) {
    option.body = _.extend(option.body, auth);
  }

  request(option, (err, response, body) => {
    'use strict';

    if (body.code === 200) {
      download(body.data);
    } else {

      if (body.code === 401) {
        co(function* () {
            'use strict';
            console.log(body.msg + ' If you have not account at http://codenut.prisf.com, you can cancel press ctrl + c');
            const email = yield prompt('email : ');
            const password = yield prompt.password('password : ');
            getAsset(asset, { email: email, password: md5(password) });
          }
        );
      } else if (body.code === 401.1) {
        console.log('Please sign up at http://codenut.prisf.com');
      } else {
        console.log(body.msg);
      }
    }
  });
};

nut
  .command('install [asset]')
  .action((asset) => {
      getAsset(asset);
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