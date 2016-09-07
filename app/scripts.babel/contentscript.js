'use strict';

// ---- jquery util
let isCreatePage = () => location.hash === '#eventpage_6';
let createButton = () => $('#maincell .action-btn-wrapper div[role="button"]');
let body = () => $('body');
let shareModal = () => $('#socialcalendarextension-share-modal');

// used as `let event = Event(); let title = event.title.value;`
let Event = () => ({
  title: $('#maincell input[type="text"]')[0],
  location: $('#maincell input[type="text"]')[1]
});
Event.toString = (event) => encodeURIComponent(`Event ${event.title.value} at ${event.location.value}`);

// ---- sharee options
let twitterUrl = 'https://twitter.com/intent/tweet?text=';
let windowOptions = `width=500, height=500,left=${(window.outerWidth - 500)/2}, top=${(window.outerHeight - 500)/ 2.5}`;

// ---- setup
window.addEventListener('hashchange', onHashChange, false);

onHashChange();
loadModal();


// ---- logic
function onHashChange() {
  console.log('hash changed');

  if(!isCreatePage()) return;

  console.log('is create page');

  let event = Event();

  createButton().on('click', setTimeout.bind(this, shareThisEvent.bind(this, event), 2000));
}

function shareThisEvent(event) {
  // window.open(twitterUrl + Event.toString(event), '', windowOptions);

  var modal = shareModal().iziModal({
    padding: 20
  });

  modal.data('event', event);

  modal.iziModal('open');
}

$(document).on('opened', shareModal().attr('id'), function (e) {
    shareModal().find('#socialcalendarextension-share-modal-twitter').on('click', () => {
      window.open(twitterUrl + Event.toString(shareModal().data('event')), '', windowOptions);
    });
});

function loadModal() {
  $.get(chrome.extension.getURL('share-popup.html'), (popup) => body().append(popup));
}