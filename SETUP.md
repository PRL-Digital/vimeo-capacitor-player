# Setup Guide

This guide will help you get started with the Vimeo Capacitor Player plugin and example app.

## Project Structure

```
vimeo-capacitor-player/
├── capacitor-video-native-bridge/    # Capacitor plugin
│   ├── ios/                          # iOS native Swift code
│   │   └── Sources/
│   │       └── VideoNativeBridgePlugin/
│   │           ├── VideoNativeBridgePlugin.swift
│   │           └── VideoPlayerDetector.swift
│   ├── android/                      # Android stub
│   ├── src/                          # TypeScript plugin code
│   │   ├── definitions.ts            # Type definitions
│   │   ├── index.ts                  # Plugin entry point
│   │   └── web.ts                    # Web implementation
│   └── package.json
├── example/                          # Vite React example app
│   ├── src/
│   │   ├── App.tsx                   # Main app with plugin integration
│   │   └── App.css                   # Styles
│   ├── ios/                          # iOS Capacitor project
│   └── capacitor.config.ts
└── README.md
```

## Quick Start

### For Plugin Development

1. **Navigate to plugin directory:**
   ```bash
   cd capacitor-video-native-bridge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the plugin:**
   ```bash
   npm run build
   ```

### For Example App

1. **Navigate to example directory:**
   ```bash
   cd example
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the web app:**
   ```bash
   npm run build
   ```

4. **Sync Capacitor:**
   ```bash
   npx cap sync
   ```

5. **Open in Xcode (macOS only):**
   ```bash
   npx cap open ios
   ```

6. **Build and run in Xcode:**
   - Select a simulator or device
   - Press Cmd+R to build and run

## Testing the Plugin

### On iOS Simulator/Device

1. Launch the app from Xcode
2. Tap the Vimeo video in the app
3. The native iOS video player should launch
4. Watch the event logs in the app UI
5. Test the control buttons (Play, Pause, Seek)

### Expected Events

- **videoPlayerOpened** - Fires when you tap the video
- **videoTimeUpdated** - Fires every 0.5 seconds during playback
- **videoPlaybackStateChanged** - Fires when play/pause state changes
- **videoPlayerClosed** - Fires when you close the native player

## Development Workflow

### Making Changes to the Plugin

1. Edit files in `capacitor-video-native-bridge/src/` or `capacitor-video-native-bridge/ios/`
2. Rebuild the plugin: `npm run build`
3. Sync in example app: `cd ../example && npx cap sync`
4. Rebuild iOS app in Xcode

### Making Changes to the Example App

1. Edit files in `example/src/`
2. Rebuild: `npm run build`
3. Sync: `npx cap sync`
4. Rebuild iOS app in Xcode

### Web Development (Browser)

For rapid UI development (note: plugin features won't work in browser):

```bash
cd example
npm run dev
```

Open http://localhost:5173 in your browser.

## Troubleshooting

### Build Errors

**Plugin build fails:**
```bash
cd capacitor-video-native-bridge
rm -rf node_modules dist
npm install
npm run build
```

**Example app build fails:**
```bash
cd example
rm -rf node_modules dist
npm install
npm run build
```

### iOS Issues

**Plugin not recognized:**
- Make sure you ran `npx cap sync` after building the plugin
- Clean build in Xcode: Product > Clean Build Folder (Cmd+Shift+K)

**CocoaPods errors (macOS):**
```bash
cd example/ios/App
pod install
```

### Plugin Not Working

1. Verify the plugin is built: check `capacitor-video-native-bridge/dist/` exists
2. Verify Capacitor sync ran: check `example/ios/App/Podfile`
3. Rebuild iOS app completely in Xcode
4. Check Xcode console for error messages

## Advanced

### Changing Vimeo Video

Edit `example/src/App.tsx`:

```tsx
const VIMEO_VIDEO_ID = 'YOUR_VIDEO_ID'
```

### Publishing the Plugin

1. Update version in `capacitor-video-native-bridge/package.json`
2. Build: `npm run build`
3. Publish: `npm publish --access public`

### Installing in Your Own App

```bash
npm install @vimeo/capacitor-video-native-bridge
npx cap sync
```

Then follow the usage examples in the [plugin README](./capacitor-video-native-bridge/README.md).

## System Requirements

- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **macOS**: Required for iOS development
- **Xcode**: 14.0 or higher
- **iOS**: 14.0 or higher (target device/simulator)

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Vimeo Player API](https://developer.vimeo.com/player)
- [iOS AVFoundation](https://developer.apple.com/av-foundation/)
- [Swift Package Manager](https://swift.org/package-manager/)

## Getting Help

- Check the [plugin README](./capacitor-video-native-bridge/README.md)
- Check the [example README](./example/README.md)
- Review the [scope document](./scope.md) for technical details
