'use strict';

let isCreatePage = () => location.hash === '#eventpage_6';
let createButton = () => $('#maincell .action-btn-wrapper div[role="button"]');

let Event = () => ({
  title: $('#maincell input[type="text"]')[0],
  location: $('#maincell input[type="text"]')[1]
});
Event.toString = (event) => encodeURIComponent(`Event ${event.title.value} at ${event.location.value}`);

let twitterUrl = 'https://twitter.com/intent/tweet?text=';
let windowOptions = `width=500, height=500,left=${(window.outerWidth - 500)/2}, top=${(window.outerHeight - 500)/ 2.5}`;

window.addEventListener('hashchange', onHashChange, false);

function onHashChange() {
  console.log('hash changed');

  if(!isCreatePage()) return;

  console.log('is create page');

  let event = Event();

  createButton().on('click', shareThisEvent.bind(this, event));
}

function shareThisEvent(event) {
  window.open(twitterUrl + Event.toString(event), '', windowOptions);
}

onHashChange();