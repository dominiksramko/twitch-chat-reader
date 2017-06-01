var domMessageParser = require('./dom-message-parser'),
    settingsManager = require('./settings-manager'),
    languages = require('./languages'),
    ttsPlayer = require('./tts-player');

var chatLines, tcrChatSettings,
  tcrLanguage, tcrActionSkipMessage, tcrActionClearQueue = '';

var registeredSliders = {};

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

function loadChatSettings() {
  settingsManager.load();

  registerSlider('.tcrVolume', '.tcrVolumeText', 'Volume');
  registerSlider('.tcrRate', '.tcrRateText', 'Rate');
  registerSlider('.tcrPitch', '.tcrPitchText', 'Pitch');

  for (var key in registeredSliders) {
    var slider = registeredSliders[key];
    slider.updateSlider(false);
  }

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
      if (!element)
        return;

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

function registerSlider(sliderInputSelector, sliderTextSelector, settingName) {
  if (settingName in registeredSliders) {
    debug.log(settingName + ' slider is registered already!');
    return null;
  }

  var slider = {};

  slider.settingName = settingName;
  slider.sliderInput = tcrChatSettings.querySelector(sliderInputSelector);
  if (!slider.sliderInput) {
    debug.log(sliderInputSelector + ' selector not found!');
    return null;
  }
  slider.sliderInput.value = settingsManager.get(settingName);

  slider.sliderText = tcrChatSettings.querySelector(sliderTextSelector);
  if (!slider.sliderText) {
    debug.log(sliderInputSelector + ' selector not found!');
    return null;
  }

  slider.updateSlider = function(saveSetting) {
    var val = slider.sliderInput.value;
    slider.sliderText.textContent = slider.settingName + ' ' + val + '%';
    if (saveSetting)
      settingsManager.set(slider.settingName, val);
  };

  slider.sliderInput.onchange = function () {
    slider.updateSlider(true);
  };

  slider.sliderInput.oninput = function() {
    slider.updateSlider(false);
  };

  registeredSliders[settingName] = slider;

  return slider;
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