// Languages

// TODO: Add domestic character detection system

// See an error? Let me know!
var saysList = {
  'de': 'sagt',
  'en': 'says',
  'es': 'dice',
  'fr': 'dit',
  'hi': 'कहते हैं',
  'id': 'mengatakan',
  'it': 'dice',
  'ja': '言います',
  'ko': '말한',
  'nl': 'zegt',
  'pl': 'mówi',
  'pt': 'diz',
  'ru': 'говорит',
  'zh': '說'
};

var voiceList = {};

module.exports = {
  getList: function() {
    return voiceList;
  },
  getName: function(key) {
    return voiceList[key].name;
  },
  getSays: function(key) {
    // TODO: Incorporate custom 'says' word
    return voiceList[key].says || '';
  },
  addVoice: function(voice) {
    var key = voice.lang;
    var name = voice.name.replace('Google', '').trim().capitalize();

    if (!voiceList[name])
      voiceList[name] = {};

    // 'Google czech female' -> 'Czech female'
    voiceList[name].name = name;
    voiceList[name].voice = voice;

    // en-US, en-GB -> en
    var saysKey = key.substring(0, 2);
    if (saysList[saysKey])
      voiceList[name].says = saysList[saysKey];
  },
  getVoice: function(voiceName) {
    for (var key in voiceList) {
      var voice = voiceList[key];
      if (voice.name == voiceName)
        return voice.voice;
    }

    return null;
  }
}