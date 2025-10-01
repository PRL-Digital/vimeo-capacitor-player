import { WebPlugin } from '@capacitor/core';

import type {
  VideoNativeBridgePlugin,
  NativePlayerActiveResult,
  PlaybackState,
  SeekOptions,
  VolumeOptions,
} from './definitions';

export class VideoNativeBridgeWeb
  extends WebPlugin
  implements VideoNativeBridgePlugin
{
  async isNativePlayerActive(): Promise<NativePlayerActiveResult> {
    console.log('VideoNativeBridge: isNativePlayerActive not available on web');
    return { active: false };
  }

  async getPlayerState(): Promise<PlaybackState> {
    console.log('VideoNativeBridge: getPlayerState not available on web');
    throw this.unavailable('This plugin is only available on native platforms');
  }

  async play(): Promise<void> {
    console.log('VideoNativeBridge: play not available on web');
    throw this.unavailable('This plugin is only available on native platforms');
  }

  async pause(): Promise<void> {
    console.log('VideoNativeBridge: pause not available on web');
    throw this.unavailable('This plugin is only available on native platforms');
  }

  async seek(_options: SeekOptions): Promise<void> {
    console.log('VideoNativeBridge: seek not available on web');
    throw this.unavailable('This plugin is only available on native platforms');
  }

  async setVolume(_options: VolumeOptions): Promise<void> {
    console.log('VideoNativeBridge: setVolume not available on web');
    throw this.unavailable('This plugin is only available on native platforms');
  }
}
