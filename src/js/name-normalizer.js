var isNumber = /\d/;
var isTrailingNumber = /\d+$/;
var isLeadingNumber = /^\d+/;
var isVinDiesel = /(?:[xX]){3,}/;

var leetDictionary = {
'0': 'o',
'1': 'i',
'2': 'z',
'3': 'e',
'4': 'a',
'5': 's',
'6': 'g',
'7': 't',
'8': 'b',
'9': 'p'
};

// Example: 69l0l69_xXxM4DxXx_420
//
// 1. Splits the names by '_'         -> [69l0l69, 'xXxM4DxXx', 420]
// 2. Remove leading numbers          -> [l0l69, 'xXxM4DxXx', ]
// 3. Remove trailing numbers         -> [l0l, 'xXxM4DxXx', ]
// 4. Remove Vin Diesel               -> [l0l, 'M4D', ]
// 5. Replace leet numbers by letters -> [lol, 'MaD', ]
// 6. Join the array using a space    -> 'lol MaD'
//
// Things to do:
// Remove short words?
// Is removing number-only 'words' necessary?
exports.normalize = function(name) {
  var words = name.split('_');

  for (var i = 0; i < words.length; i++) {
    // Some words or phrases might be read in a different way when capitalized, hence the lowercasing
    words[i] = words[i].toLowerCase();

    // Remove leading and trailing numbers
    words[i] = words[i].replace(isLeadingNumber, '');
    words[i] = words[i].replace(isTrailingNumber, '');

    // Remove Vin Diesel
    words[i] = words[i].replace(isVinDiesel, '');

    // Replace l33t characters
    for (var key in leetDictionary) {
      words[i] = words[i].split(key).join(leetDictionary[key]);
    }

    // Remove numbers only
    if (!isNaN(words[i])) words[i] = '';
  }

  return words.join('');
}