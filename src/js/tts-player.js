var languages = require('./languages'),
    settingsManager = require('./settings-manager'),
    debug = require('./helpers/debug'),
    ttsService = require('./tts-service');

var isPlaying = false;

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();
exports.ee = ee;

ttsService.ee.on('audio-finished', function() {
  isPlaying = false;
  ee.emit('audio-finished');
});

exports.stop = function(reason) {
  if (isPlaying) {
    reason = reason || '';
    ttsService.cancel();
    isPlaying = false;
    ee.emit('audio-stopped', reason);
  }
}

exports.isMuted = function() {
  var volume = parseInt(settingsManager.get('Volume')) / 100;
  return volume == 0;
}

exports.play = function(message) {
  if (isPlaying) return;
  isPlaying = true;

  ttsService.speak(message);
}

exports.isPlaying = function() {
  return isPlaying;
}