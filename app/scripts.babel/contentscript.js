'use strict';

// ---- jquery util
let isCreatePage = () => location.hash.match(/^#eventpage_6/);
let createButton = () => $('#maincell .action-btn-wrapper div[role="button"]');
let body = () => $('body');
let shareModal = (query) => $('#socialcalendarextension-share-modal' + (query ? `-${query}` : ''));

// used as `let event = Event(); let title = event.title.value;`
let Event = () => ({
  $title: $('#maincell input[type="text"]')[0],
  $location: $('#maincell input[type="text"]')[1]
});
Event.toText = (event) => `Event ${event.title} at ${event.location}`;
Event.toLink = (event) => encodeURIComponent(Event.toText(event));
Event.setValues = (event) => {
  event.title = event.$title.value;
  event.location = event.$location.value;
};

// ---- sharee options
let twitterUrl = 'https://twitter.com/intent/tweet?text=';
let facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=https://calendar.google.com';
let gplusUrl = 'https://plus.google.com/share?url=https://calendar.google.com';
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

  createButton().on('click', setTimeout.bind(this, shareThisEvent.bind(this, event), 800));
}

function shareThisEvent(event) {
  // window.open(twitterUrl + Event.toLink(event), '', windowOptions);

  var modal = shareModal().iziModal({
    padding: 20
  });

  Event.setValues(event);
  modal.data('event', event);

  shareModal('text').text(Event.toText(event));

  modal.iziModal('open');
}

$(document).on('opened', shareModal().attr('id'), function (e) {
    shareModal('twitter').on('click', () => {
      window.open(twitterUrl + Event.toLink(shareModal().data('event')), '', windowOptions);
    });
    shareModal('facebook').on('click', () => {
      window.open(facebookUrl, '', windowOptions);
    });
    shareModal('gplus').on('click', () => {
      window.open(gplusUrl, '', windowOptions);
    });
});

function loadModal() {
  $.get(chrome.extension.getURL('share-popup.html'), (popup) => body().append(popup));
}