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

  var isChatLine = dom.hasClass(newNode, 'chat-line');
  var isAdminPost = dom.hasClass(newNode, 'admin');
  if (!isChatLine || isAdminPost) return;


  var senderElement = newNode.querySelector('.from');
  var messageElement = newNode.querySelector('.message');
  if (!senderElement || !messageElement) return;

  // Add a badge for 'special' users
  var userName = senderElement.firstChild.textContent.toLowerCase().trim();

  var hasBadge = badges.contains(userName);
  if (hasBadge) {
    var badgeSpan = newNode.querySelector('.badges');
    var badge = badges.getBadgeElement(userName);
    if (badgeSpan) badgeSpan.appendChild(badge);
  }

  var isEnabled = settingsManager.getBool('Enabled');
  if (!isEnabled) return;

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

  parseSender(senderElement);
  parseMessage(messageElement);

  function parseSender(senderElement) {
    var textName = senderElement.firstChild.textContent.trim();

    // BTTV includes data-sender atribute and removes intl-login if the name is foreign
    var isVanilla = !newNode.getAttribute('data-sender');
    var isForeign = isVanilla ?
      dom.hasChildClass(senderElement, '.intl-login') :
      (newNode.getAttribute('data-sender') != textName.toLowerCase());

    messageData['name']['displayName'] = textName;

    if (isVanilla) {
      if (isForeign) {
        // Slicing both sides to get rid of the parenthesis
        // (MingLee) = MingLee
        messageData['name']['profileName'] = senderElement.querySelector('.intl-login').textContent.slice(1, -1);
      } else {
        messageData['name']['profileName'] = textName.toLowerCase();
      }
    } else {
      messageData['name']['profileName'] = newNode.getAttribute('data-sender');
    }

    messageData['name']['isForeign'] = isForeign;
  }

  function parseMessage(messageElement) {
    var messageNodes = messageElement.childNodes;

    for (var j = 0; j < messageNodes.length; j++) {
      var messageNode = messageNodes[j];

      // Parse non-empty texts
      if (dom.isTag(messageNode, '#text')) {
        var data = messageNode.data.trim();

        if (data !== '') {
          messageData.messageList.push({
            type: 'text',
            data: data
          });
        }

        continue;
      }

      // Parse emotes
      var emoteElement = messageNode.querySelector('img.emoticon');
      if (emoteElement) {
        var emoteName = emoteElement.alt;

        messageData.messageList.push({
          type: 'emote',
          data: emoteName
        });

        continue;
      }

      // Parse recipients/mentioned users
      var mentioningElement = messageNode.querySelector('.mentioning');
      if (mentioningElement) {
        var userName = mentioningElement.textContent.slice(1);
        var isIncluded = messageData.recipients.includes(userName);
        if (!isIncluded) messageData.recipients.push(userName);

        continue;
      }

      // Parse links
      if (dom.isTag(messageNode, 'a')) {
        var data = messageNode.textContent.trim();
        messageData.messageList.push({
          type: 'link',
          data: data
        });
      }
    }

    // Parse the raw message
    messageData['_messageRaw'] = messageElement.innerText;
  }

  // Emits an event with the message data for message-manager
  ee.emit('message-parsed', messageData);
}