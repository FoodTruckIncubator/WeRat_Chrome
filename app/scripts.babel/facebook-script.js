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

  let postButton = () => $('#socialcalendarextension-share-modal-facebook');
  let connectButton = () => $('#socialcalendarextension-connect-facebook');

  function statusChangeCallback(response) {
    console.log(response);
    if(response.status === 'connected') {
      postButton().removeClass('sce-disabled');
      connectButton().hide();
    } else {
      connectButton().show();
    }
  }

  function checkFacebookLoginState(callback) {
    FB('getLoginStatus', null, statusChangeCallback);
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

  window.checkFacebookLoginState = checkFacebookLoginState;
  window.confirmPostToFacebook = confirmPostToFacebook;
  window.FB = FB;
})();