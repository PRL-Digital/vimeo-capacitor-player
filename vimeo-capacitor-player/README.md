# @vimeo/vimeo-capacitor-player

A Capacitor plugin that bridges native iOS video player events with JavaScript, enabling seamless monitoring and control of native video playback from your web application.

## Overview

This plugin solves iOS fullscreen video issues by detecting when HTML video elements (including Vimeo iframes) trigger native playback and providing a JavaScript bridge to monitor and control the native iOS video player (AVPlayerViewController).

## Features

- 🎥 Detect when native iOS video player opens/closes
- 📊 Monitor playback state (playing/paused)
- ⏱️ Track current time and duration
- 🎮 Control playback (play, pause, seek, volume)
- 🔌 Simple event-based API
- ✅ Works with Vimeo iframes, HTML5 video, and other video sources

## Installation

```bash
npm install @vimeo/vimeo-capacitor-player
npx cap sync
```

## iOS Setup

The plugin works automatically on iOS 14.0+. No additional configuration is required.

## Android Support

Android support is planned for future releases. Currently, the plugin will reject method calls on Android with a "Not implemented" error.

## Usage

### Basic Setup

```typescript
import { VideoNativeBridge } from '@vimeo/vimeo-capacitor-player';

// Listen for when native video player opens
await VideoNativeBridge.addListener('videoPlayerOpened', (info) => {
  console.log('Video opened:', info.url);
  console.log('Duration:', info.duration);
  console.log('Is playing:', info.isPlaying);
});

// Listen for when native video player closes
await VideoNativeBridge.addListener('videoPlayerClosed', () => {
  console.log('Video player closed');
});
```

### Monitor Playback State

```typescript
// Listen for playback state changes (play/pause)
await VideoNativeBridge.addListener('videoPlaybackStateChanged', (state) => {
  console.log('Playing:', state.isPlaying);
  console.log('Current time:', state.currentTime);
  console.log('Duration:', state.duration);
});

// Listen for periodic time updates (every 0.5 seconds)
await VideoNativeBridge.addListener('videoTimeUpdated', (time) => {
  console.log('Progress:', time.currentTime, '/', time.duration);
  // Update your UI with playback progress
});
```

### Control Playback

```typescript
// Check if native player is active
const { active } = await VideoNativeBridge.isNativePlayerActive();

// Get current player state
const state = await VideoNativeBridge.getPlayerState();

// Control the player
await VideoNativeBridge.play();
await VideoNativeBridge.pause();
await VideoNativeBridge.seek({ time: 30 }); // Seek to 30 seconds
await VideoNativeBridge.setVolume({ volume: 0.5 }); // 50% volume
```

### With Vimeo Iframe

```html
<iframe
  src="https://player.vimeo.com/video/76979871"
  width="640"
  height="360"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
></iframe>
```

The plugin automatically detects when the user taps the Vimeo video and iOS launches the native player.

### Cleanup

```typescript
// Remove all listeners when component unmounts
await VideoNativeBridge.removeAllListeners();
```

## API Reference

### Events

#### `videoPlayerOpened`

Fired when the native video player opens.

**Payload:**

```typescript
interface VideoPlayerInfo {
  url: string; // URL of the video
  duration?: number; // Duration in seconds (may be undefined initially)
  isPlaying: boolean; // Whether video is playing
}
```

#### `videoPlayerClosed`

Fired when the native video player closes. No payload.

#### `videoPlaybackStateChanged`

Fired when playback state changes (play/pause).

**Payload:**

```typescript
interface PlaybackState {
  isPlaying: boolean; // Whether video is playing
  currentTime: number; // Current time in seconds
  duration: number; // Total duration in seconds
}
```

#### `videoTimeUpdated`

Fired periodically (every 0.5 seconds) during playback.

**Payload:**

```typescript
interface VideoTimeInfo {
  currentTime: number; // Current time in seconds
  duration: number; // Total duration in seconds
}
```

### Methods

#### `isNativePlayerActive()`

Check if the native video player is currently active.

**Returns:** `Promise<{ active: boolean }>`

#### `getPlayerState()`

Get the current playback state.

**Returns:** `Promise<PlaybackState>`

#### `play()`

Resume playback in the native player.

**Returns:** `Promise<void>`

#### `pause()`

Pause playback in the native player.

**Returns:** `Promise<void>`

#### `seek(options: { time: number })`

Seek to a specific time in the video.

**Parameters:**

- `time` - Time in seconds to seek to

**Returns:** `Promise<void>`

#### `setVolume(options: { volume: number })`

Set the volume of the native player.

**Parameters:**

- `volume` - Volume level from 0.0 (muted) to 1.0 (full volume)

**Returns:** `Promise<void>`

## Example

See the [example app](../example) for a complete React implementation with Vimeo integration.

## Platform Support

| Platform | Status       | Notes                             |
| -------- | ------------ | --------------------------------- |
| iOS      | ✅ Supported | iOS 14.0+                         |
| Android  | ⏳ Planned   | Coming in future release          |
| Web      | ⚠️ Stub      | Methods throw "unavailable" error |

## Limitations

- **iOS Only:** Currently only supports iOS. Android implementation is planned.
- **Native Player Only:** Only detects when iOS launches its native video player. Inline video playback is not monitored.
- **Single Player:** Designed for single video player instances. Multiple simultaneous players may have unexpected behavior.

## Troubleshooting

### Video doesn't trigger native player

Make sure your video element or iframe allows fullscreen:

```html
<iframe allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
```

### Events not firing

1. Ensure you're testing on a physical iOS device or iOS simulator
2. Check that the plugin is properly synced: `npx cap sync`
3. Rebuild your iOS app in Xcode

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
