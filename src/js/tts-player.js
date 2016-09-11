var languages = require('./languages'),
    settingsManager = require('./settings-manager'),
    debug = require('./helpers/debug');

var isPlaying = false;

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

exports.ee = ee;

function audioFinished() {
  isPlaying = false;
  ee.emit('audio-finished');
}

exports.stop = function(reason) {
  if (isPlaying) {
    reason = reason || '';
    responsiveVoice.cancel();
    isPlaying = false;
    exports.playAudio();
    ee.emit('audio-stopped', reason);
  }
}

exports.isMuted = function() {
  var volume = parseInt(settingsManager.get('Volume')) / 100;
  console.log(volume);
  return volume == 0;
}

exports.play = function(message) {
  if (isPlaying) return;

  isPlaying = true;

  var languageKey = settingsManager.get('Language')
  var language = languages.getValue(languageKey);

  var settings = {};
  settings.volume = parseInt(settingsManager.get('Volume')) / 100;
  settings.onend = audioFinished;

  debug.log(settings);

  // TODO: Make sure responsiveVoice exists and is ready
  responsiveVoice.speak(message, language, settings);
}

exports.isPlaying = function() {
  return isPlaying;
}