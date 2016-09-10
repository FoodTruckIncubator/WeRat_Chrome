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

    FB[event.data.fb.fn].apply(FB, event.data.fb.params.concat(callback));
  }


if(window.addEventListener) {
  addEventListener('message', listener, false);
} else {
  attachEvent('onmessage', listener);
}
})();