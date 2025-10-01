import type { PluginListenerHandle } from '@capacitor/core';

/**
 * Information about the video player when it opens
 */
export interface VideoPlayerInfo {
  /**
   * The URL of the video being played
   */
  url: string;
  /**
   * Duration of the video in seconds (may be undefined initially)
   */
  duration?: number;
  /**
   * Whether the video is currently playing
   */
  isPlaying: boolean;
}

/**
 * Current playback state of the video
 */
export interface PlaybackState {
  /**
   * Whether the video is currently playing
   */
  isPlaying: boolean;
  /**
   * Current playback time in seconds
   */
  currentTime: number;
  /**
   * Total duration of the video in seconds
   */
  duration: number;
}

/**
 * Video time update information
 */
export interface VideoTimeInfo {
  /**
   * Current playback time in seconds
   */
  currentTime: number;
  /**
   * Total duration of the video in seconds
   */
  duration: number;
}

/**
 * Options for seeking to a specific time
 */
export interface SeekOptions {
  /**
   * Time to seek to in seconds
   */
  time: number;
}

/**
 * Options for setting volume
 */
export interface VolumeOptions {
  /**
   * Volume level from 0.0 (muted) to 1.0 (full volume)
   */
  volume: number;
}

/**
 * Result indicating if native player is active
 */
export interface NativePlayerActiveResult {
  /**
   * Whether the native video player is currently active
   */
  active: boolean;
}

export interface VideoNativeBridgePlugin {
  /**
   * Check if the native video player is currently active
   * @returns Promise that resolves with active status
   */
  isNativePlayerActive(): Promise<NativePlayerActiveResult>;

  /**
   * Get the current playback state of the video
   * @returns Promise that resolves with current playback state
   */
  getPlayerState(): Promise<PlaybackState>;

  /**
   * Play the video in the native player
   * @returns Promise that resolves when play command is sent
   */
  play(): Promise<void>;

  /**
   * Pause the video in the native player
   * @returns Promise that resolves when pause command is sent
   */
  pause(): Promise<void>;

  /**
   * Seek to a specific time in the video
   * @param options - Object containing the time to seek to
   * @returns Promise that resolves when seek command is sent
   */
  seek(options: SeekOptions): Promise<void>;

  /**
   * Set the volume of the video player
   * @param options - Object containing the volume level (0.0 to 1.0)
   * @returns Promise that resolves when volume is set
   */
  setVolume(options: VolumeOptions): Promise<void>;

  /**
   * Listen for when the native video player opens
   * @param eventName - Must be 'videoPlayerOpened'
   * @param listenerFunc - Callback function that receives video player info
   * @returns Promise that resolves to a listener handle
   */
  addListener(
    eventName: 'videoPlayerOpened',
    listenerFunc: (info: VideoPlayerInfo) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Listen for when the native video player closes
   * @param eventName - Must be 'videoPlayerClosed'
   * @param listenerFunc - Callback function called when player closes
   * @returns Promise that resolves to a listener handle
   */
  addListener(
    eventName: 'videoPlayerClosed',
    listenerFunc: () => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Listen for video playback state changes
   * @param eventName - Must be 'videoPlaybackStateChanged'
   * @param listenerFunc - Callback function that receives playback state
   * @returns Promise that resolves to a listener handle
   */
  addListener(
    eventName: 'videoPlaybackStateChanged',
    listenerFunc: (state: PlaybackState) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Listen for periodic video time updates
   * @param eventName - Must be 'videoTimeUpdated'
   * @param listenerFunc - Callback function that receives time info
   * @returns Promise that resolves to a listener handle
   */
  addListener(
    eventName: 'videoTimeUpdated',
    listenerFunc: (time: VideoTimeInfo) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Remove all listeners for this plugin
   * @returns Promise that resolves when all listeners are removed
   */
  removeAllListeners(): Promise<void>;
}
