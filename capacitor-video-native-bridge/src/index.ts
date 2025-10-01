import { registerPlugin } from '@capacitor/core';

import type { VideoNativeBridgePlugin } from './definitions';

const VideoNativeBridge = registerPlugin<VideoNativeBridgePlugin>(
  'VideoNativeBridge',
  {
    web: () => import('./web').then((m) => new m.VideoNativeBridgeWeb()),
  },
);

export * from './definitions';
export { VideoNativeBridge };
