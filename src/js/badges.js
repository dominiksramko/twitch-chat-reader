var badgePeople = {
  'drstiny': { title: 'TCR Developer', image: 'drstiny.jpg' },
  'hrathir': { title: 'TCR Tester',    image: 'hrathir.jpg' }
}

var cdnUrl = 'https://dl.dropboxusercontent.com/u/48098533/cdn/images/';

var badgeElement = document.createElement('div');
badgeElement.className = 'badge';

module.exports = {
  contains: function(user) {
    return badgePeople.hasOwnProperty(user);
  },
  getBadgeElement: function(user) {
    badgeElement.setAttribute('original-title', badgePeople[user].title);
    var badgeUrl = "url('" + cdnUrl + badgePeople[user].image + "')";
    badgeElement.style.backgroundImage = badgeUrl;
    return badgeElement.cloneNode();
  }
}