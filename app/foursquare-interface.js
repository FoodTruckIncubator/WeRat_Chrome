'use strict';

(function() {
  function listener(event) {
    if(!event || !event.data || !event.data.from || event.data.from !== 'socialcalendarextension') return;
    if(!event.data.fs) return;

    window.postMessage({
      to: 'socialcalendarextension',
      for: event.data.fs.fn
    }, '*');
  }

  if(window.addEventListener) {
    addEventListener('message', listener, false);
  } else {
    attachEvent('onmessage', listener);
  }

  window.connectFoursquare = function() {
    listener({
      data: {
        from: 'socialcalendarextension',
        fs: { fn: 'connectFoursquare' }
      }
    });
  }
})();