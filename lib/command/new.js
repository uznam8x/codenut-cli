﻿﻿const cli = require('commander');
const nut = cli.arguments('<nut>');
const fs = require('fs');
const fse = require('fs-extra');
const mkdir = require('mkdirp');
const rimraf = require('rimraf');
const path = require('path');
const requrest = require('request');
const ProgressBar = require('progress');
const async = require('async');
const spawn = require('child_process').spawn;
const extract = require('extract-zip');
nut
  .command('new [project]')
  .action((project) => {
      'use strict';
      let directory = path.resolve('.', './' + project);

      if (fs.existsSync(path.resolve(directory))) {
        console.log('Already exist \'' + path.relative('.', directory) + '\' directory ');
        process.exit(0);
      }

      mkdir(directory, (err) => {
        if (err) {
          console.error(err);
        } else {
          const fileName = 'archive.zip';
          async.series([
              (callback) => {
                const archive = 'https://github.com/uznam8x/generator-codenut/archive/master.zip';
                const file = fs.createWriteStream(directory + '/' + fileName);
                let req = requrest(archive);
                req.on('response', (data) => {
                  console.log('## Codenut project downloading and installing modules takes few minute. so... What about go outside get some fresh air.');
                  const bar = new ProgressBar('Downloading for Codenut project [:bar] :rate/bps :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: parseInt(data.headers['content-length'], 10),
                  });

                  req.on('data', (chunk) => {
                    bar.tick(chunk.length);
                  });
                  req.on('end', () => {
                    setTimeout(() => {
                      callback(null);
                    }, 2000);

                  });
                });

                req.pipe(file);
                req.end();
              },

              (callback) => {
                console.log('## Unzip downloaded file.');

                extract(path.resolve(directory, fileName), { dir: directory, defaultDirMode: '0755' }, function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    callback(null);
                  }
                })
              },

              (callback) => {
                fse.copy(directory + '/generator-codenut-master/generators/app/templates', directory, (err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    callback(null);
                  }
                })
              },

              (callback) => {
                console.log('## Delete temporary file.');
                rimraf(directory + '/generator-codenut-master', function (err) {
                  if (err) {
                    console.error(err);
                  } else {
                    callback(null);
                  }
                });
              },

              (callback) => {
                fs.unlink(directory + '/' + fileName);
                callback(null);
              },
              (callback) => {
                const file = ['package.json', 'bower.json'];
                for (let key in file) {
                  let data = fs.readFileSync(directory + '/' + file[key], 'utf8');
                  let content = data.replace(new RegExp('<%= name %>', 'g'), project);
                  fs.writeFileSync(directory + '/' + file[key], content);
                }

                console.log('## Installing npm and bower modules.');
                let child = spawn('cd ' + project + ' && npm install && bower install && node ./node_modules/gulp/bin/gulp.js compile', {
                  shell: true,
                  stdio: 'inherit',
                });

                child.on('exit', function (code) {
                  callback(null);
                });
              }
            ],
            (err, result) => {
              if (err) {
                console.error(err);
              }

              console.log('## Everything is ready!');
            }
          )
        }
      });
    }
  );
