'use strict';

// ---- jquery util
let isCreatePage = () => location.hash.match(/^#eventpage_6/);
let createButton = () => $('#maincell .action-btn-wrapper div[role="button"]');
let body = () => $('body');
let shareModal = (query) => $('#socialcalendarextension-share-modal' + (query || ''));

// used as `let event = Event(); let title = event.title.value;`
let Event = () => ({
  $title: $('#maincell input[type="text"]')[0],
  $location: $('#maincell input[type="text"]')[1],
  $datetime: $('#maincell .ep-edr-first-line input')
});

Event.imageUrl = (event) => {
  return 'https://placeholdit.imgix.net/~text?txtsize=33&bg=bbbbbb&txtclr=666666&w=400&h=300&txttrack=0&txt='
    + Event.toLink(event);
}

Event.toText = (event) => {
  let datetime = event.date;
  if(!event.isAllDay) datetime += ' ' + event.time;

  return `In ${datetime}, ${event.title} at ${event.location}`;
}

Event.toLink = (event) => encodeURIComponent(Event.toText(event));

Event.setValues = (event) => {
  event.title = event.$title.value;
  event.location = event.$location.value;

  event.date = event.$datetime[0].value;
  event.time = event.$datetime[1].value;

  event.isAllDay = $('#maincell input[type="checkbox"]:first').is(':checked');
};

// ---- sharee options
let twitterUrl = 'https://twitter.com/intent/tweet?text=';
let facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=https://calendar.google.com';
let gplusUrl = (url) => 'https://plus.google.com/share?url=' + encodeURIComponent(url);
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

function loadModal() {
  $.get(chrome.extension.getURL('/views/share-popup.html'), (popup) => {
    body().append(popup);
    checkFacebookLoginState();
  });
}

function handleModalButtons() {
  checkFacebookLoginState();
  let event = shareModal().data('event');

  shareModal('-text').text(`"${Event.toText(event)}"`);

  shareModal('-twitter').off('click').on('click', () => {
    window.open(twitterUrl + Event.toLink(event), '', windowOptions);
  });
  shareModal('-facebook').off('click').on('click', () => {
    confirmPostToFacebook(Event, event);
  });
  shareModal('-gplus').off('click').on('click', () => {
    window.open(gplusUrl(Event.imageUrl(event)), '', windowOptions);
  });
  shareModal('-foursquare').off('click').on('click', () => {
    tryPostAtFoursquare(Event, event);
  });
}

$(document).on('opened', shareModal().attr('id'), handleModalButtons);