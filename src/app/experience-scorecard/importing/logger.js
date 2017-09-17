const USE_LOG = true;

const log = function() {

  if(USE_LOG) {
    console.log(arguments);
  }
}

exports.default = {
  log
};