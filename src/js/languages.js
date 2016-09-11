// Languages

// TODO: Fix 'says' for eastern languages
// TODO: Add character detection system
var languageList = {
  'enUS': {
    name: 'English (US)',
    value: 'US English Female',
    says: 'says'
  },
  'enGB': {
    name: 'English (UK)',
    value: 'UK English Female',
    says: 'says'
  },
  'enAU': {
    name: 'English (AU)',
    value: 'Australian Female',
    says: 'says'
  },
  'ar': {
    name: 'Arabic',
    value: 'Arabic Female',
    says: 'يقول'
  },
  'ptBR': {
    name: 'Brazilian Portuguese',
    value: 'Brazilian Portuguese Female',
    says: 'diz'
  },
  'zhCN': {
    name: 'Chinese',
    value: 'Chinese Female',
    says: '說'
  },
  'zhTW': {
    name: 'Chinese (TW)',
    value: 'Chinese Taiwan Female',
    says: '說'
  },
  'cs': {
    name: 'Czech',
    value: 'Czech Female',
    says: 'říká'
  },
  'da': {
    name: 'Danish',
    value: 'Danish Female',
    says: 'siger'
  },
  'de': {
    name: 'Deutsch',
    value: 'Deutsch Female',
    says: 'sagt'
  },
  'nl': {
    name: 'Dutch',
    value: 'Dutch Female',
    says: 'zegt'
  },
  'fi': {
    name: 'Finnish',
    value: 'Finnish Female',
    says: 'sanoo'
  },
  'fr': {
    name: 'French',
    value: 'French Female',
    says: 'dit'
  },
  'el': {
    name: 'Greek',
    value: 'Greek Female',
    says: 'λέει'
  },
  'hi': {
    name: 'Hindi',
    value: 'Hindi Female',
    says: 'कहते हैं'
  },
  'hu': {
    name: 'Hungarian',
    value: 'Hungarian Female',
    says: 'mondja'
  },
  'id': {
    name: 'Indonesian',
    value: 'Indonesian Female',
    says: 'mengatakan'
  },
  'it': {
    name: 'Italian',
    value: 'Italian Female',
    says: 'dice'
  },
  'ja': {
    name: 'Japanese',
    value: 'Japanese Female',
    says: '言います'
  },
  'ko': {
    name: 'Korean',
    value: 'Korean Female',
    says: '말한'
  },
  'no': {
    name: 'Norwegian',
    value: 'Norwegian Female',
    says: 'sier'
  },
  'pl': {
    name: 'Polish',
    value: 'Polish Female',
    says: 'mówi'
  },
  'pt': {
    name: 'Portuguese',
    value: 'Portuguese Female',
    says: 'diz'
  },
  'ru': {
    name: 'Russian',
    value: 'Russian Female',
    says: 'говорит'
  },
  'sk': {
    name: 'Slovak',
    value: 'Slovak Female',
    says: 'hovorí'
  },
  'esES': {
    name: 'Spanish',
    value: 'Spanish Female',
    says: 'dice'
  },
  'esMX': {
    name: 'Spanish (Latin)',
    value: 'Spanish Latin American Female',
    says: 'dice'
  },
  'sv': {
    name: 'Swedish',
    value: 'Swedish Female',
    says: 'säger'
  },
  'th': {
    name: 'Thai',
    value: 'Thai Female',
    says: 'กล่าวว่า'
  },
  'tr': {
    name: 'Turkish',
    value: 'Turkish Female',
    says: 'diyor'
  },
  'vi': {
    name: 'Vietnamese',
    value: 'Vietnamese Male',
    says: 'nói'
  }
}

// TODO: Check if the language key exists
module.exports = {
  getList: function() {
    return languageList;
  },
  getName: function(key) {
    return languageList[key].name;
  },
  getValue: function(key) {
    return languageList[key].value;
  },
  getSays: function(key) {
    return languageList[key].says;
  }
}