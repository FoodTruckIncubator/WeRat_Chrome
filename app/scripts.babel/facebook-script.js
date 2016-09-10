(function() {
  function FB(fn, params, callback) {
    if(!params) params = [];
    if(!(params instanceof Array)) params = [params];

    window.postMessage({
      from: 'socialcalendarextension',
      fb: { fn, params }
    }, '*');

    let listener = listenerFor(fn);

    if(window.addEventListener) {
      addEventListener('message', listener, false);
    } else {
      attachEvent('onmessage', listener);
    }

    function listenerFor(fnFor) {
      return function(event) {
        if(!event || !event.data || !event.data.to || event.data.to !== 'socialcalendarextension') return;
        if(event.data.for !== fnFor) return;

        console.log(event.data);

        removeEventListener('message', listener, false);

        callback(event.data.response);
      }
    }
  }

  let postButton = () => $('#socialcalendarextension-facebook');
  let connectButton = () => $('#socialcalendarextension-connect-facebook');

  function statusChangeCallback(response) {
    console.log(response);
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      postButton().removeClass('sce-disabled');
      testAPI();
    } else {
      connectButton().show();
    }
  }

  function checkFacebookLoginState(callback) {
    FB('getLoginStatus', null, statusChangeCallback);
  }

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB('api', ['/me'], function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

  window.checkFacebookLoginState = checkFacebookLoginState;
  window.FB = FB;
})();