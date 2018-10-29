import GATrack from 'ga-track';

let start = new Date().getTime();
let duration = 0;
let hasTracked = false;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    duration += new Date().getTime() - start;

    if (GATrack.debug) {
      navigator.sendBeacon('/_beacon', JSON.stringify({ state: 'hidden', duration, start }));
    }
  } else {
    start = new Date().getTime();

    if (GATrack.debug) {
      navigator.sendBeacon('/_beacon', JSON.stringify({ state: 'visible', duration, start }));
    }
  }
});

const track = function() {
  if (hasTracked) {
    return;
  }

  const end = new Date().getTime();
  const tos = (end - start + duration) / 1000;

  if (tos > 60 * 10) { // Don't track if > 10 mins
    return;
  }

  const data = {
    eventCategory: 'ga-track',
    eventAction: 'timeonsite',
    eventLabel: 'seconds',
    eventValue: Math.round(tos),
    transport: 'beacon'
  };

  window.ga('send', 'event', data);
  GATrack.send('event', data);
  hasTracked = true;

  if (GATrack.debug) {
    navigator.sendBeacon('/_beacon', JSON.stringify(data));
  }
};

window.addEventListener('beforeunload', track);
window.addEventListener('pagehide', track);
