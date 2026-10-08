/** Entry point. Loaded as a module from index.html. */
import { initCopyEmail, initYear, initDemoPreviews } from './ui.js';
import { mountFlatFallback } from './mockups.js';

initCopyEmail();
initYear();
initDemoPreviews();

// The 3D stage pulls three.js from a CDN, so load it separately:
// if the CDN, WebGL, or the GPU fails, the page still works with flat images.
const fallbackTimer = setTimeout(mountFlatFallback, 6000);

import('./stage.js')
  .then(({ initStage }) => {
    initStage();
    clearTimeout(fallbackTimer);
  })
  .catch((err) => {
    clearTimeout(fallbackTimer);
    console.warn('3D stage unavailable, using flat images.', err);
    mountFlatFallback();
  });
