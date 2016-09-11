var debug = require ('./helpers/debug'),
    settingsManager = require('./settings-manager'),
    nameNormalizer = require('./name-normalizer'),
    languages = require('./languages');

// Returns processed message i.e: "Drstiny says: HeyGuys"
exports.process = function(messageData, lastSender) {
  // Ignore my own messages
  if (settingsManager.getBool('IgnoreSelf') && cookie.get('login') == messageData['name']['profileName']) {
    debug.log('It\'s my own message and I don\'t want that, returning null');
    return null;
  }

  // Ignore messages for others
  var ignoreMsgsForOthers = settingsManager.getBool('IgnoreMsgsForOthers');
  var recipients = messageData.recipients;
  var amIncluded = false;
  if (ignoreMsgsForOthers && recipients.length > 0) {
    for (var i = 0; i < recipients.length; i++) {
      if (recipients[i] === cookie.get('login')) {
        amIncluded = true;
        break;
      }
    }

    if (!amIncluded) return null;
  }

  var name = processName(messageData.name, lastSender);
  var message = processMessage(messageData);
  if (message === null) return null;

  var textString = name + message;
  return textString;
}

function processName(nameData, lastSender) {
  var readUsernames = settingsManager.getBool('ReadUsernames');
  if (!readUsernames) return '';

  var nameString = '';

  var displayName = nameData.displayName;
  var profileName = nameData.profileName;
  var isForeign = nameData.isForeign;
  var usedName = '';

  if (isForeign) {
    if (false) {
      // TODO: Check if we can translate the name
    } else {
      usedName = profileName;
    }
  } else {
    usedName = displayName;
  }

  // If the same user sends another consecutive message within 30 seconds, we won't read his name
  var timeSinceLastMessage = (Date.now() - lastSender.time)/1000;
  var sameUser = lastSender.name === profileName && timeSinceLastMessage <= 30;
  if (sameUser) return '';

  var normalizeUserName = settingsManager.getBool('NormalizeUsernames');
  var userName = (normalizeUserName) ? nameNormalizer.normalize(usedName) : usedName;

  // TODO: Add custom "says" word option
  var saysWord = languages.getSays(settingsManager.get('Language'));

  nameString += userName.toLowerCase();
  nameString += ' ' + saysWord;
  nameString += ': '; // This adds a little pause that helps distinguish name from message

  return nameString;
}

// TODO:
// Find repeated patterns [haHAA GREAT ADVICE haHAA GREAT ADVICE haHAA GREAT ADVICE]
// Omit the patterns if the pattern character length is bigger than 10 (blablabla is ok) [LOLLOLLOLLOLLOLLOL = LOL]

// TODO:
// Adjust abbreviations to a readable form [btw = by the way] [afaik = as far as I know]
// http://www.connexin.net/internet-acronyms.html
// For English only?

function processMessage(messageData) {
  var profileName = messageData['name']['profileName'];
  var rawMessage = messageData['_messageRaw'];
  var messageList = messageData['messageList'];

  // TODO: Make a setting for emote spam?
  var emotesIncluded = [];

  var messageString = '';

  // Ignore commands
  if (settingsManager.getBool('IgnoreCommands') && rawMessage.charAt(0) === '!') {
    debug.log('Command found, returning null');
    return null;
  }

  for (var i = 0; i < messageList.length; i++) {
    var messageEntry = messageList[i];
    var type = messageEntry.type;
    var data = messageEntry.data;

    messageString += ' ';

    if (type === 'text') {
      // Remove links here?
      // Remove spaces here?
      // Trim the message (unnecessary space)

      messageString += data;
    }

    if (type === 'emote' && !emotesIncluded.includes(data)) {
      messageString += data;
      emotesIncluded.push(data);
    }
  }

  return messageString;
}