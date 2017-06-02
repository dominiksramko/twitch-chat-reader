var debug = require('./helpers/debug');

var defaultValues = {
  'Enabled': true,
  'Language': 'US English',
  'Volume': '50',
  'Rate': '100',
  'Pitch': '100',
  'IgnoreSelf': true,
  'IgnoreMsgsForOthers': true,
  'IgnoreLinks': true,
  'IgnoreCommands': true,
  'ReadUsernames': true,
  'NormalizeUsernames': true,
  'SpamFilter': true
}

var prefix = 'tcr';

var settings = {};

// Using single object to store all the settings
function getStorage() {
  var storage = localStorage[prefix];
  if (storage === undefined) {
    storage = '{}';
    localStorage[prefix] = storage;
  }

  return JSON.parse(storage);
}

function setStorage(storage) {
  localStorage.setItem(prefix, JSON.stringify(storage));
}

exports.load = function() {
  var storage = getStorage();

  for (var prop in defaultValues) {
    var setting = storage[prop];

    if (setting === undefined) {
      var defaultValue = defaultValues[prop];
      setting = defaultValue;
      storage[prop] = defaultValue;
    }

    settings[prop] = setting;
  }

  setStorage(storage);
}

exports.get = function(item) {
  var storage = getStorage();
  return storage[item];
}

// Probably not needed anymore
// Settings are now stored in a single object that will return booleans upon JSON.parse
exports.getBool = function(item) {
  var storage = getStorage();
  return JSON.parse(storage[item]);
}

exports.set = function(item, value) {
  debug.log('settingsManager.set('+item+','+value+')');

  var storage = getStorage();

  storage[item] = value;
  settings[item] = value;

  setStorage(storage);
}

exports.default = function(item) {
  var defaultValue = defaultValues[item];
  exports.set(item, defaultValue);
  return defaultValue;
}

exports.getAllSettings = function() {
  var storage = getStorage();
  return storage;
}