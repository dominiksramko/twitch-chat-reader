module.exports = {
  hasClass: function(node, className) {
    if (node && node.classList && node.classList.contains(className)) return true;
    return false;
  },
  isTag: function(node, tagName) {
    return (node && node.nodeName && node.nodeName.toLowerCase().includes(tagName));
  },
  hasChildClass: function(node, className) {
    return node.querySelector(className) != null;
  }
}