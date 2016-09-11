// TODO:
// Switching channel fix (without refresh)

var debug = require('./helpers/debug');

var messageManager = require('./message-manager'),
    domManager = require('./dom-manager');

function load() {
  domManager.start();
  messageManager.registerEvents();

  window.TCR['LOADED'] = true;
  debug.log('Loaded!');
}

if (!window.TCR) {
  window.TCR = {};
  window.TCR['LOADED'] = false;
  window.TCR['DEBUG'] = true;
  load();
}