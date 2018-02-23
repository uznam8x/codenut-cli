const cli = require('commander');
const nut = cli.arguments('<nut>');
const async = require('async');
const gm = require('gm').subClass({ imageMagick: true });
const fs = require('fs');
const mkdir = require('mkdirp');
const path = require('path');

// # GENERATOR : ICON
const appicon = (file, dist) => {
  'use strict';

  const config = {
    ios: [
      { size: 20 },
      { size: 29 },
      { size: 40 },
      { size: 40 },
      { size: 50 },
      { size: 57 },
      { size: 58 },
      { size: 60 },
      { size: 72 },
      { size: 76 },
      { size: 80 },
      { size: 87 },
      { size: 100 },
      { size: 114 },
      { size: 120 },
      { size: 144 },
      { size: 152 },
      { size: 167 },
      { size: 180 },
      { size: 512 },
      { size: 1024 },
    ],
    android: [
      { size: 48 },
      { size: 72 },
      { size: 96 },
      { size: 144 },
      { size: 192 },
      { size: 512 },
    ],
    web: [
      { size: 16 },
      { size: 32 },
      { size: 48 },
      { size: 64 },
      { size: 96 },
      { size: 128 },
      { size: 192 },
    ],
    ms: [
      { size: 70 },
      { size: 150 },
      { size: 310 },
    ],
  };

  const meta = [];
  for (let key in config) {
    for (let i = 0, len = config[key].length; i < len; i++) {
      meta.push({ size: config[key][i].size, platform: key });
    }
  }

  let directory = 'app/prod/resource/icon/';

  async.each(meta, (data, cb) => {
    mkdir(directory + data.platform, (err) => {
      if (err) {
        console.error(err);
      } else {
        let fileName = data.size + 'x' + data.size;
        if (data.platform === 'web') {
          let output = directory + data.platform + '/' + fileName + '.ico';
          gm(file)
            .borderColor('white')
            .border(0, 0)
            .alpha('off')
            .colors(256)
            .resize(data.size, data.size)
            .write(output, function (err) {
              if (err) {
                console.error(err);
                return cb(err);
              } else {
                console.log('generated appicon : %s', output);
                cb(null);
              }
            });

        } else {
          let output = directory + data.platform + '/' + fileName + '.png';
          gm(file)
            .background('none')
            .noProfile()
            .resize(data.size, data.size)
            .gravity('Center')
            .quality(100)
            .write(output, function (err) {
              if (err) {
                console.error(err);
                return cb(err);
              } else {
                console.log('generated appicon : %s', output);
                cb(null);
              }
            });
        }
      }
    });

  }, (err, cb) => {
    // complete
    if (err) {
      if (cb) return cb(err);
      else throw err;
    }

    const link = '<link rel="{{rel}}" sizes="{{size}}" href="{{href}}" type="{{type}}" />';

    let el = '';
    for (let i = 0, len = config['ios'].length; i < len; i++) {
      let fileName = config['ios'][i].size + 'x' + config['ios'][i].size;
      el += link.replace(/{{rel}}/g, 'apple-touch-icon')
        .replace(/{{size}}/g, fileName)
        .replace(/{{type}}/g, 'image/png')
        .replace(/{{href}}/g, '/resource/icon/ios/' + fileName + '.png') + '\n';
    }

    for (let i = 0, len = config['web'].length; i < len; i++) {
      let fileName = config['web'][i].size + 'x' + config['web'][i].size;
      el += link.replace(/{{rel}}/g, 'icon')
        .replace(/{{size}}/g, fileName)
        .replace(/{{type}}/g, 'image/x-icon')
        .replace(/{{href}}/g, '/resource/icon/web/' + fileName + '.ico') + '\n';
    }

    el += '<link rel="manifest" href="/resource/icon/manifest.json" />';

    mkdir('app/dev/element/', (err) => {
      'use strict';
      if (err) {
        console.error(err);
      } else {
        let content = '';
        if (fs.existsSync('app/dev/element/link.nunjucks')) {
          content = fs.readFileSync('app/dev/element/link.nunjucks', 'utf-8');
          content += '\n';
        }

        fs.writeFile('app/dev/element/link.nunjucks', content + el, 'utf-8', () => {
          console.log('modify file : app/dev/element/link.nunjucks');
        });

        content = '';
        if (fs.existsSync('app/dev/element/meta.nunjucks')) {
          content = fs.readFileSync('app/dev/element/meta.nunjucks', 'utf-8');
          content += '\n';
        }

        let meta = '<meta name="msapplication-config" content="/resource/icon/browserconfig.xml" />';
        fs.writeFile('app/dev/element/meta.nunjucks', content + meta, 'utf-8', () => {
          console.log('modify file : app/dev/element/meta.nunjucks');
        });
      }
    });

    let content = fs.readFileSync(path.resolve(__dirname, '../../template/icon/browserconfig.xml'), 'utf-8');
    fs.writeFile('app/prod/resource/icon/browserconfig.xml', content, 'utf-8', () => {
      console.log('create file : app/prod/resource/icon/browserconfig.xml');
    });

    content = fs.readFileSync(path.resolve(__dirname, '../../template/icon/manifest.json'), 'utf-8');
    fs.writeFile('app/prod/resource/icon/manifest.json', content, 'utf-8', () => {
      console.log('create file : app/prod/resource/icon/manifest.json');
    });

    if (cb) {
      cb(null);
    }
  });
};

// # GENERATOR : WEB FONT
const Fontmin = require('fontmin');
const webfont = (src, dist) => {
  'use strict';

  dist = ('app/prod/resource/font/' + dist).replace(/\/\//g, '/');

  let fontmin = new Fontmin();
  fontmin.src(src).dest(dist);

  fontmin.run(function (err, files) {
    if (err) throw err;
    glob(dist + '/*.css', null, (err, arr) => {
      if (err) throw err;
      concat(arr, dist + '/base.css');
    });

    console.log('generated webfont : ' + dist);
  });
};

nut
  .command('generate [type] [file] [dist]')
  .action((type, file, dist) => {
      if (type === 'webfont') {
        webfont(file, dist);
      } else if (type === 'appicon') {
        appicon(file);
      }
    }
  )
;

// # PAGE
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
          let page = fs.readFileSync(path.resolve(__dirname, '../../template/page/base.html'), 'utf-8');
          fs.writeFile(location, page, 'utf-8', () => {
            console.log('create page : ' + location);
          });
        }
      });
    }
  )
;