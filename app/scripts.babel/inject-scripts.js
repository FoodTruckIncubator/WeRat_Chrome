'use strict';

(function(d, s) {
  function l(id, u) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;

    js = d.createElement(s); js.id = id;
    js.src = chrome.extension.getURL(u);
    fjs.parentNode.insertBefore(js, fjs);
  }

  l('facebook-jssdk', 'facebook-sdk.js');

  l('facebook-socialcalendarextension-script', 'facebook-interface.js');
  l('foursquare-socialcalendarextension-script', 'foursquare-interface.js');

})(document, 'script');