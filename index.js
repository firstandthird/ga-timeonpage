import GATrack from 'ga-track';

let start = new Date().getTime();
let duration = 0;
let hasTracked = false;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    duration += new Date().getTime() - start;
  } else {
    start = new Date().getTime();
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

  GATrack.send('event', data);
  hasTracked = true;
};

window.addEventListener('beforeunload', track);
window.addEventListener('pagehide', track);
