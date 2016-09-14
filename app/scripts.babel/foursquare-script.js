'use strict';

(function() {
  let listenerForConnectCallback;
  let accessToken;

  function addListenerFor(fnFor, callback) {
    let listener = listenerFor(fnFor, callback);
    addEventListener('message', listener, false);

    return listener;
  }
  function listenerFor(fnFor, callback) {
    return function(event) {
      if(!event || !event.data || !event.data.to || event.data.to !== 'socialcalendarextension') return;
      if(event.data.for !== fnFor) return;

      callback(event.data);
    }
  }

  let callbackUrl = 'https://foodtruckincubator.github.io/WeRat_Chrome/foursquare-callback.html';
  let clientId = 'NCHNPGBJPIRJ44SFBIZYH2CP4G2JYF4OOBMDTYFZQ1L1ZLKD';
  let baseUrl = 'https://foursquare.com/';
  let apiBaseUrl = 'https://api.foursquare.com/v2';
  let placesList = () => $('.socialcalendarextension-foursquare-places');
  let loading = () => $('.socialcalendarextension-loading');

  let authUrl = `${baseUrl}/oauth2/authenticate?client_id=${clientId}&response_type=token&redirect_uri=${callbackUrl}`;
  let searchUrl = (token, near) => `${apiBaseUrl}/venues/search?v=20160913&intent=browse&oauth_token=${token}&near=${encodeURIComponent(near)}`;
  let checkinUrl = (token, id, msg) => `${apiBaseUrl}/checkins/add?v=20160913&oauth_token=${token}&venueId=${id}&shout=${msg}`;

  let windowOptions = `width=500, height=500,left=${(window.outerWidth - 500)/2}, top=${(window.outerHeight - 500)/ 2.5}`;

  function connectFoursquare(callback) {
    listenerForConnectCallback = addListenerFor('connectFoursquareCallback', connectCallback(callback));
    window.open(authUrl, '', windowOptions);
  }

  function connectCallback(callback) {
    return function(data) {
      removeEventListener('message', listenerForConnectCallback, false);

      let search = data.response + '&'; // ensure parse

      search = search.substr(search.indexOf('access_token=') + 13); // front access_token= to front
      search = search.substr(0, search.indexOf('&')); // from 0 until first &
      search = decodeURIComponent(search);

      let token = search;

      chrome.storage.sync.set({ foursquareToken: token }, function() {
        console.log(`Token ${token} saved`);

        accessToken = token;
        callback();
      });
    }
  }

  function confirmPostToFoursquare(Event, event, venue, callback) {
    swal({
      title: 'Post in Foursquare',
      text: `Write what you want to share <small>(in ${venue.name})</small>:`,
      type: 'input',
      showCancelButton: true,
      html: true,
      inputValue: Event.toText(event)
    }, callback);
  }
  function postToFoursquare(venue, message) {
    loading().fadeIn();
    placesList().hide();

    $.post(checkinUrl(accessToken, venue.id, message), function(response) {
      loading().fadeOut();

      swal({
        title: 'Nice!',
        text: `You checked in <strong>${message}</strong> at <strong>${venue.name}</strong> `,
        type: 'success',
        html: true
      });
    });
  }

  function buildPlaceLi(Event, event) {
    return function(venue) {
      return $('<li class="socialcalendarextension-foursquare-li">').html(`
        <span class="sce-f-li-name">${venue.name}</span>
        <span class="sce-f-li-location">${venue.location.formattedAddress.join(' - ')}</span>
      `).on('click', confirmPostToFoursquare.bind(null, Event, event, venue, function(inputValue) {
        if(inputValue === false) return false;

        if(inputValue === '') {
          swal.showInputError('You need to write something!');
          return false;
        }
        postToFoursquare(venue, inputValue);
      }));
    }
  }
  function listFoursquarePlaces(Event, event) {
    loading().fadeIn();
    $.get(searchUrl(accessToken, event.location), (response) => {
      loading().fadeOut();
      let lis = response.response.venues.map(buildPlaceLi(Event, event));

      placesList().show().find('> ul').html('').append(lis);
    });
  }

  function tryPostAtFoursquare(Event, event) {
    chrome.storage.sync.get('foursquareToken', function(result) {
      if(result.foursquareToken) {
        accessToken = result.foursquareToken;
        return listFoursquarePlaces(Event, event);
      }

      swal({
        title: 'Connect at Foursquare',
        text: 'Click in <strong>Ok</strong> to connect with Foursquare first',
        type: 'info',
        showCancelButton: true,
        html: true,
        inputValue: Event.toText(event)
      }, connectFoursquare.bind(null, listFoursquarePlaces.bind(null, Event, event)));
    });
  }

  window.tryPostAtFoursquare = tryPostAtFoursquare;
})();