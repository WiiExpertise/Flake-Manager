const colors = require('colors');

const logger = {
  success: function(data) {
    data = colors.green('[SUCCESS] > ') + data;

    console.log(data);
  },
  alert: function(data) {
    data = colors.yellow('[ALERT] > ') + data;

    console.log(data);
  },
  crash: function(data) {
    data = colors.red('[CRASH] > ') + data;

    console.log(data);
  }
};


module.exports = logger;