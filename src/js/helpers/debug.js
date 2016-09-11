module.exports = {
  log: function() {
    var debugEnabled = window.TCR && window.TCR['DEBUG'];
    if (!debugEnabled) return;

    var args = Array.prototype.slice.call(arguments);
    console.log.apply(console.log, ['TCR:'].concat(args));
  }
};
