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
  if (hasTracked || !GATrack.isEnabled) {
    return;
  }

  const end = new Date().getTime();
  const tos = (end - start + duration) / 1000;

  if (tos > 60 * 10) { // Don't track if > 10 mins
    return;
  }

  const args = ['event'];
  let data = {};

  if (GATrack.isGTag) {
    data = {
      name: 'timeonsite',
      value: Math.round(tos),
      event_category: 'ga-track',
      event_label: 'seconds'
    };

    args.push('timeonsite');
  } else if (GATrack.isGA) {
    data = {
      eventCategory: 'ga-track',
      eventAction: 'timeonsite',
      eventLabel: 'seconds',
      eventValue: Math.round(tos),
      transport: 'beacon'
    };
  }

  args.push(data);

  GATrack.send.apply(null, args);

  hasTracked = true;
};

window.addEventListener('beforeunload', track);
window.addEventListener('pagehide', track);
