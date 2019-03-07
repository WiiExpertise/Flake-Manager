// A E S T H E T I C S

const colors = require('colors');

const logger = {
  write: function(data) {
    data = colors.green('[INFO] > ') + data;

    console.log(data);
  },
  warn: function(data) {
    data = colors.yellow('[WARNING] > ') + data;

    console.log(data);
  },
  error: function(data) {
    data = colors.red('[ERROR] > ') + data;

    console.log(data);
  },
  fatal: function(data, alert, shutdown) {
    logger.error(data);

    if(shutdown !== false) {
      if(alert !== false) {
        logger.warn('Server shutting down...');
      }

      process.exit();
    }
  }
};


module.exports = logger;
