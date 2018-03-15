const path = require('path');

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
