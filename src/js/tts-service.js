var languages = require('./languages'),
    debug = require('./helpers/debug'),
    settingsManager = require('./settings-manager');

var synth = window.speechSynthesis;

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();
exports.ee = ee;

exports.start = function() {
  if (typeof speechSynthesis === 'undefined') {
    debug.log('speechSynthesis not unsupported');
    return;
  }

  var voiceCount = synth.getVoices().length;

  if (voiceCount == 0) {
    // TODO: An error might occur if voice is added/removed with TCR open
    synth.onvoiceschanged = function() {
      populateVoiceList();
    };
  } else {
    populateVoiceList();
  }
}

exports.speak = function(message) {
  var utterThis = new SpeechSynthesisUtterance(message);

  var voiceName = settingsManager.get('Language');
  var voice = languages.getVoice(voiceName);

  if (!voice) {
    debug.log('Invalid voice');
    audioFinished();
    return;
  }

  utterThis.voice = voice;

  var volume = parseInt(settingsManager.get('Volume')) / 100;
  utterThis.volume = volume;

  var pitch = parseInt(settingsManager.get('Pitch')) / 100;
  utterThis.pitch = pitch;

  var rate = parseInt(settingsManager.get('Rate')) / 100;
  utterThis.rate = rate;

  utterThis.onend = function() {
    audioFinished();
  };

  utterThis.onerror = function(e) {
    debug.log('An error has occured while speaking', e);
    audioFinished();
  };

  try {
    synth.speak(utterThis);
  } catch (e) {
    debug.log('An error has occured while uttering', utterThis);
    audioFinished();
  }
}

function audioFinished() {
  ee.emit('audio-finished');
}

function populateVoiceList() {
  var voices = synth.getVoices().filter(function(voice){
    return voice.name.includes('Google');
  });

  voices.forEach(function(voice) {
    languages.addVoice(voice);
  });

  ee.emit('service-ready');
}