(function() {
  function FB(fn, params, callback, callbackFirst) {
    if(!params) params = [];
    if(!(params instanceof Array)) params = [params];

    window.postMessage({
      from: 'socialcalendarextension',
      fb: { fn, params },
      callbackFirst: !!callbackFirst
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

  let postButton = () => $('#socialcalendarextension-share-modal-facebook');
  let connectButton = () => $('#socialcalendarextension-connect-facebook');
  let loading = () => $('.socialcalendarextension-loading');

  function statusChangeCallback(response) {
    console.log(response);
    if(response.status === 'connected') {
    } else {
    }
  }

  function checkFacebookLoginState(callback) {
    FB('getLoginStatus', null, tryPostAtFacebook);
  }
  function checkFacebookLoginStateOnly(callback) {
    FB('getLoginStatus', null, () => {});
  }

  function confirmPostToFacebook(Event, event) {
    swal({
      title: 'Post in Facebook',
      text: 'Write what you want to share:',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      inputValue: Event.toText(event)
    }, function(inputValue) {
      if(inputValue === false) return false;

      if(inputValue === '') {
        swal.showInputError('You need to write something!');
        return false;
      }
      postToFacebook(inputValue);
    });
  }
  function postToFacebook(text) {
    FB('api', [
      '/me/feed',
      'POST',
      {
        message: text,
        privacy: { value: 'SELF' }
      }
    ], function (response) {
      if (response && !response.error) {
        swal({
          title: 'Nice!',
          text: `You can check your post <a href="https://www.facebook.com/${response.id}" target="_blank">clicking here</a>!`,
          type: 'success',
          html: true
        });
      } else {
        console.error('error on posting', response);
        swal({
          title: 'Something went wrong!',
          type: 'error'
        });
      }
    });
  }

  function tryPostAtFacebook(Event, event) {
    loading().fadeIn();
    FB('getLoginStatus', null, function(response) {
      loading().fadeOut();
      if(response.status === 'connected') {
        confirmPostToFacebook(Event || __Event, event || __event);
      } else {
        swal({
          title: 'Connect at Facebook',
          text: 'Click in <strong>Ok</strong> to connect with Facebook first',
          type: 'info',
          showCancelButton: true,
          html: true
        }, () => {
          FB('login', [{ scope: 'public_profile,email,user_posts' }], tryPostAtFacebook.bind(null, Event, event), true);
        });
      }
    });
  }

  window.checkFacebookLoginState = checkFacebookLoginState;
  window.checkFacebookLoginStateOnly = checkFacebookLoginStateOnly;
  window.tryPostAtFacebook = tryPostAtFacebook;
  window.FB = FB;
})();