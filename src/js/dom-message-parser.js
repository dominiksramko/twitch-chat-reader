var dom = require('./helpers/dom');

var badges = require('./badges'),
    settingsManager = require('./settings-manager');

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

exports.ee = ee;

exports.parse = function(mutation) {
  if (mutation.addedNodes.length === 0) return;

  var newNode = mutation.addedNodes[0];

  // Object format:
  // - _messageRaw
  // - name (profileName and displayName don't match if the displayName uses foreign characters)
  //  - profileName
  //  - displayName
  // - recipients (list of all the people @mentioned)
  // - messageList (includes all child nodes of the span.message)
  //  - text (type: text, data: text data)
  //  - emote (type: emote, data: img.emoticon alt)

  var messageData = {
    _messageRaw: '',
    name: { profileName: '', displayName: '', isForeign: false },
    recipients: [],
    messageList: []
  }

  var isNotChatLine = !dom.hasClass(newNode, 'chat-line');
  var isAdminPost = dom.hasClass(newNode, 'admin');
  if (isNotChatLine || isAdminPost) return;

  // Add a badge for 'special' users
  var rawSender = newNode.querySelector('.from');
  if (rawSender) {
    var userName = rawSender.firstChild.textContent.toLowerCase().trim();

    var hasBadge = badges.contains(userName);
    if (hasBadge) {
      var badgeSpan = newNode.querySelector('.badges');
      var badge = badges.getBadgeElement(userName);
      if (badgeSpan.length) badgeSpan.appendChild(badge);
    }
  }

  var isNotEnabled = !settingsManager.getBool('Enabled');
  if (isNotEnabled) return;

  // DOM structure:
  // ul.chat-lines
  //   div.chat-line (data-sender)
  //     span.from (textContent)
  //     span.badges
  //       div.broadcaster.badge
  //     span.message (data-raw)
  //       text (data)
  //       span.user-mention (textContent)
  //       img.emoticon (alt)

  var childNodes = newNode.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    var childNode = childNodes[i];

    // Parse the sender
    if (dom.hasClass(childNode, 'from')) {
      var textName = childNode.firstChild.textContent.trim();

      // BTTV includes data-sender atribute and removes intl-login if the name is foreign
      var isVanilla = ! newNode.getAttribute('data-sender');
      var isForeign = isVanilla ?
        dom.hasChildClass(childNode, '.intl-login') :
        (newNode.getAttribute('data-sender') != textName.toLowerCase());

      messageData['name']['displayName'] = textName;

      if (isVanilla) {
        if (isForeign) {
          // Slicing both sides to get rid of the parenthesis
          // (MingLee) = MingLee
          messageData['name']['profileName'] = childNode.querySelector('.intl-login').textContent.slice(1, -1);
        } else {
          messageData['name']['profileName'] = textName.toLowerCase();
        }
      } else {
        messageData['name']['profileName'] = newNode.getAttribute('data-sender');
      }

      messageData['name']['isForeign'] = isForeign;
    }

    // Parse the message
    if (dom.hasClass(childNode, 'message')) {
      var messageNodes = childNode.childNodes;

      for (var j = 0; j < messageNodes.length; j++) {
        var messageNode = messageNodes[j];

        // Parse non-empty texts
        if (dom.isTag(messageNode, 'text')) {
          var data = messageNode.data.trim();
          var isNotEmpty = data !== '';
          if (isNotEmpty) messageData.messageList.push({type: 'text', data: data});
        }

        // Parse recipients
        if (dom.hasClass(messageNode, 'user-mention')) {
          var userName = messageNode.textContent.slice(1);
          var isNotIncluded = !messageData.recipients.includes(userName);
          if (isNotIncluded) messageData.recipients.push(userName);
        }

        // Parse emotes
        if (dom.hasClass(messageNode, 'emoticon')) {
          var emoteName = messageNode.alt;

          messageData.messageList.push({type: 'emote', data: emoteName});
        }
      }

      // Parse the raw message
      messageData['_messageRaw'] = childNode.innerText;
    }
  }

  // Emits an event with the message data for message-manager
  ee.emit('message-parsed', messageData);
}