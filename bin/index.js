#!/usr/bin/env node
const cli = require('commander');
const chalk = require('chalk');
const Progress = require('progress');
const nut = cli.arguments('<nut>');

//require('../lib/command/install');
require('../lib/command/generator');
require('../lib/command/create');
require('../lib/command/new');

// # LAYOUT
nut
  .command('layout [comp]')
  .action((comp) => {
      console.log('coming soom');
    }
  )
;

nut.parse(process.argv);
module.exports = this;
