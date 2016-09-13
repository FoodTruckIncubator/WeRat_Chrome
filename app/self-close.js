location.search;
"?code=X132GXUC4ZPWPTUC5CZ4YED3D0HDCD5DB4DMHBJDWAXNADZH";
// window.close();

window.parent.postMessage({
  for: 'connectFoursquareCallback',
  to: 'socialcalendarextension',
  response: location.search
}, '*');
