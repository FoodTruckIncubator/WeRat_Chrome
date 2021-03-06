'use strict';

(function() {
  function listener(event) {
    if(!event || !event.data || !event.data.from || event.data.from !== 'socialcalendarextension') return;
    if(!event.data.fb) return;

    if(!window.FB || !window.FB[event.data.fb.fn]) return setTimeout(function() { listener(event); }, 200);

    console.log(event.data);

    function callback(response) {
      console.log(response);

      window.postMessage({
        to: 'socialcalendarextension',
        for: event.data.fb.fn,
        response: response
      }, '*');
    };


    if(event.data.fb.fn === 'getLoginStatus') return FB.getLoginStatus(callback);

    let params = event.data.fb.params;
    params = event.data.callbackFirst ? [callback].concat(params) : params.concat(callback);

    FB[event.data.fb.fn].apply(FB, params);
  }

  if(window.addEventListener) {
    addEventListener('message', listener, false);
  } else {
    attachEvent('onmessage', listener);
  }

  window.checkFacebookLoginState = function() {
    listener({
      data: {
        from: 'socialcalendarextension',
        fb: { fn: 'getLoginStatus' }
      }
    });
  }
})();