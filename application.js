(function() {
  var CBI_IMG_BASE = 'http://www.community-boating.org/wp-content/themes/communityboating/images/';
  var flagImg = function(flagColor) {
    return CBI_IMG_BASE + (function(flagColor) {
      switch (flagColor) {
        case "G":
            return 'green-flag';
        case "Y":
            return 'yellow-flag';
        case "R":
            return 'red-flag';
        default:
            return 'burgee';
      }
    })(flagColor) + '.png';
  };

  var updateBadge = function () {
    $.get('https://portal2.community-boating.org/pls/apex/CBI_PROD.FLAG_JS', {}, function(r) {
      chrome.browserAction.setIcon({
        path: flagImg(Function(r + 'return FLAG_COLOR;')()),
      });
    });

    chrome.storage.sync.get({
      frequency: constants.DEFAULT_FREQUENCY,
    }, function(items) {
      refreshLoop = setTimeout(updateBadge, items.frequency * 1000);
    });
  };

  var refreshLoop;

  chrome.contextMenus.create({
    title: "CBI Website",
    contexts: ["browser_action"],
    onclick: function() {
      window.open('http://community-boating.org');
    }
  });

  chrome.contextMenus.create({
    title: "Refresh",
    contexts: ["browser_action"],
    onclick: function() {
      clearTimeout(refreshLoop);
      updateBadge();
    }
  });

  updateBadge();
})();
