// TODO:
// Switching channel fix (without refresh)

var debug = require('./helpers/debug');

var messageManager = require('./message-manager'),
    domManager = require('./dom-manager'),
    ttsService = require('./tts-service');

function load() {
  ttsService.start();

  ttsService.ee.on('service-ready', function() {
    if (!window.TCR.LOADED) {
      domManager.start();
      messageManager.registerEvents();

      window.TCR['LOADED'] = true;
      debug.log('Loaded!');
    }
  });
}

if (!window.TCR || !window.TCR.LOADED) {
  window.TCR = {};
  window.TCR['LOADED'] = false;
  window.TCR['DEBUG'] = true;

  if(document.readyState === "complete") {
    load();
  } else {
    window.addEventListener("onload", function() {
      load();
    }, false);
  }
}