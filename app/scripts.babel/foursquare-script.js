'use strict';

(function() {
  let listenerForConnectFoursquare = addListenerFor('connectFoursquare', connectFoursquare);
  let listenerForConnectCallback;

  function addListenerFor(fnFor, callback) {
    let listener = listenerFor(fnFor, callback);
    addEventListener('message', listener, false);

    return listener;
  }
  function listenerFor(fnFor, callback) {
    return function(event) {
      if(!event || !event.data || !event.data.to || event.data.to !== 'socialcalendarextension') return;
      if(event.data.for !== fnFor) return;

      callback(event.data);
    }
  }

  let callbackUrl = chrome.extension.getURL('/views/self-close.html');
  let clientId = 'NCHNPGBJPIRJ44SFBIZYH2CP4G2JYF4OOBMDTYFZQ1L1ZLKD';
  let baseUrl = 'https://pt.foursquare.com/oauth2/authenticate';

  let authUrl = `${baseUrl}?client_id=${clientId}&response_type=code&redirect_uri=${callbackUrl}`;

  let windowOptions = `width=500, height=500,left=${(window.outerWidth - 500)/2}, top=${(window.outerHeight - 500)/ 2.5}`;

  function connectFoursquare() {
    let listenerForConnectCallback = addListenerFor('connectFoursquareCallback', connectCallback);
    window.open(authUrl, '', windowOptions);
  }

  function connectCallback(data) {
    let response = data.response;

    alert(response);
  }
})();