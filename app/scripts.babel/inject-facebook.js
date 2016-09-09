'use strict';

(function (d, s, id) {
  var js,
      fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);js.id = id;
  js.src = chrome.extension.getURL('facebook-sdk.js');
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

(function (d, s, id) {
  var js,
      fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);js.id = id;
  js.src = chrome.extension.getURL('facebook-script.js');
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-socialcalendarextension-script');