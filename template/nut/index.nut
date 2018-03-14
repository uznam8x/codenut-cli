const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = {
  '{{comp}}': {
    props: {},
    beforeCreate: (config) => {
      return config;
    },
    created: (rendered) => {
      return rendered;
    },
    template: path.resolve(__dirname, './template.html'),
  }
};
