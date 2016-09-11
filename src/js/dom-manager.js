var domMessageParser = require('./dom-message-parser'),
    settingsManager = require('./settings-manager'),
    languages = require('./languages'),
    ttsPlayer = require('./tts-player');

var chatLines, tcrChatSettings, tcrVolume, tcrVolumeText,
      tcrLanguage, tcrActionSkipMessage, tcrActionClearQueue = '';

var observer = new MutationObserver(function(mutations) {
  for (var i = 0; i < mutations.length; i++) {
    var mutation = mutations[i];
    domMessageParser.parse(mutation);
  }
});

var observerConfig = { attributes: true, childList: true, characterData: true };
var isObserving = false;

exports.start = function() {
  injectChatSettings();
  loadChatSettings();
  startObserving();
}

function injectChatSettings() {
  // TODO: Check if the settings are already injected
  var chatSettings = document.querySelector('.chat-settings');

  tcrChatSettings = document.createElement('div');
  tcrChatSettings.className = 'tcrChatSettings';
  var languageList = languages.getList();
  var tcrChatSettingsData = require('../templates/chat-settings')(languageList);
  tcrChatSettings.innerHTML = tcrChatSettingsData;

  if (chatSettings) chatSettings.appendChild(tcrChatSettings);
}

// TODO: Add types/events into settings-manager for dynamicity
function loadChatSettings() {
  settingsManager.load();

  tcrVolume = tcrChatSettings.querySelector('.tcrVolume');
  tcrVolume.value = settingsManager.get('Volume');
  tcrVolumeText = tcrChatSettings.querySelector('.tcrVolumeText');
  tcrVolume.onchange = function () {
    updateVolume(true);
  };

  tcrVolume.oninput = function() {
    updateVolume(false);
  };

  updateVolume(false);

  tcrLanguage = tcrChatSettings.querySelector('.tcrLanguage');
  tcrLanguage.value = settingsManager.get('Language');
  tcrLanguage.onchange = function() {
    settingsManager.set('Language', tcrLanguage.value);
  };

  // Action buttons
  tcrActionSkipMessage = tcrChatSettings.querySelector('.tcrActionSkipMessage');
  tcrActionSkipMessage.onclick = function() {
    ttsPlayer.stop('skipped');
  };

  tcrActionClearQueue = tcrChatSettings.querySelector('.tcrActionClearQueue');
  tcrActionClearQueue.onclick = function() {
    ttsPlayer.stop('queue-cleared');
  };

  var checkBoxes = ['Enabled', 'SpamFilter', 'IgnoreSelf','IgnoreMsgsForOthers', 'IgnoreLinks',
   'IgnoreCommands', 'ReadUsernames', 'NormalizeUsernames'];
  for (var i = 0; i < checkBoxes.length; i++) {
    (function(index) {
      var checkBox = checkBoxes[index];

      var element = tcrChatSettings.querySelector('.tcr'+checkBox);
      var setting = settingsManager.getBool(checkBox);

      // One way to convert string to boolean
      element.checked = setting;
      element.onchange = function() {
        // In case we disable TCR
        if (checkBox === 'Enabled' && element.checked === false) {
          ttsPlayer.stop('disabled');
        }

        settingsManager.set(checkBox, element.checked);
      }
    })(i);
  }
}

function updateVolume(saveSetting) {
  var volume = tcrVolume.value;
  tcrVolumeText.textContent = 'Volume ' + volume + '%';
  if (saveSetting) settingsManager.set('Volume', volume);
}

function startObserving() {
  chatLines = document.querySelector('ul.chat-lines');

  if (chatLines && !isObserving) {
    isObserving = true;
    observer.observe(chatLines, observerConfig);
  }
}

// TODO: Make use of this
function restartObserver() {
  observer.disconnect();
  isObserving = false;
  startObserving();
}