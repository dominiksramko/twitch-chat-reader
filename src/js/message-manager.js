var domMessageParser = require ('./dom-message-parser'),
    messageProcessor = require('./message-processor'),
    settingsManager = require('./settings-manager'),
    ttsPlayer = require('./tts-player'),
    debug = require('./helpers/debug');

var messageQueue = [];
var lastSender = { name: '', time: 1000 };

// Stores raw messages for the spam filter
var messageHistory = [];
var historyLength = 5;

function getNext() {
  var isEnabled = settingsManager.getBool('Enabled');

  // Clearing queue when the Enabled is true (Should be event-based)
  if (!isEnabled) return null;

  // var isMuted = ttsPlayer.isMuted();

  if (messageQueue.length === 0) return null;

  var nextMessage = messageQueue.shift();

  // TODO: Improve the spam filter
  // Dummy spam filter
  //var spamFilterEnabled = settingsManager.getBool('SpamFilter');
  //var rawMessage = nextMessage['_messageRaw'];
  //if (messageHistory.length >= historyLength) messageHistory.shift();
  //if (spamFilterEnabled && messageHistory.includes(rawMessage)) return null;
  //messageHistory.push(rawMessage);

  lastSender.time = Date.now();

  var processedMessage = messageProcessor.process(nextMessage, lastSender);

  if (processedMessage === null) {
    debug.log('Processed message is null, returning null');
    return null;
  }

  lastSender.name = nextMessage['name']['profileName'];

  return processedMessage;
}

function playNext() {
  if (ttsPlayer.isPlaying()) return;
  var nextMessage = getNext();

  // TODO: An empty message is being sent (double bug?)
  if (nextMessage === null) {
    debug.log('nextMessage is null, returning');
    return;
  }

  ttsPlayer.play(nextMessage);
}

exports.registerEvents = function() {
  domMessageParser.ee.on('message-parsed', function(messageData) {
    messageQueue.push(messageData);
    playNext();
  });

  ttsPlayer.ee.on('audio-finished', function() {
    playNext();
  });

  ttsPlayer.ee.on('audio-stopped', function(reason) {
    // Clear the queue
    if (reason == 'disabled') {
      messageQueue = [];
      lastSender = { name: '', time: 1000 }
    }

    if (reason == 'skipped') {
      playNext();
    }

    if (reason == 'queue-cleared') {
      messageQueue = [];
    }
  });
}