import GATrack from 'ga-track';
import { on, ready } from 'domassist';

let start;
let duration;
let hasTracked;

const initialize = () => {
  start = new Date().getTime();
  duration = 0;
  hasTracked = false;
};

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

initialize();

ready(() => {
  window.addEventListener('beforeunload', track);
  window.addEventListener('pagehide', track);

  // Force send for SPAs
  on(document.body, 'timeonsite:send', () => {
    track();
    initialize();
  });
});
