# Vimeo Capacitor Player

A Capacitor plugin that bridges native iOS video player with JavaScript, enabling seamless monitoring and control of native video playback.

## 📦 Packages

This monorepo contains:

- **[capacitor-video-native-bridge](./capacitor-video-native-bridge)** - The Capacitor plugin
- **[example](./example)** - Vite React example app with Vimeo integration

## 🚀 Quick Start

### Plugin Installation

```bash
npm install @vimeo/capacitor-video-native-bridge
npx cap sync
```

See the [plugin README](./capacitor-video-native-bridge/README.md) for detailed usage instructions.

### Running the Example

```bash
cd example
npm install
npm run build
npx cap sync
npx cap open ios
```

See the [example README](./example/README.md) for more details.

## 📖 Documentation

- **[Plugin README](./capacitor-video-native-bridge/README.md)** - Plugin API and usage
- **[Example README](./example/README.md)** - Example app setup and development
- **[Scope Document](./scope.md)** - Project scope and technical specifications

## 🎯 Features

- Detect native iOS video player launch and close events
- Monitor playback state and progress
- Control video playback programmatically
- Works with Vimeo iframes, HTML5 video, and more
- TypeScript support with full type definitions

## 🛠️ Development

### Project Structure

```
vimeo-capacitor-player/
├── capacitor-video-native-bridge/    # Capacitor plugin
│   ├── ios/                          # iOS native code (Swift)
│   ├── android/                      # Android stub
│   ├── src/                          # TypeScript definitions
│   └── README.md
├── example/                          # Example Vite React app
│   ├── src/
│   ├── ios/
│   └── README.md
├── scope.md                          # Project specification
└── README.md
```

### Building the Plugin

```bash
cd capacitor-video-native-bridge
npm install
npm run build
```

### Running Tests

The example app serves as a comprehensive test suite for the plugin functionality.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🔗 Links

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Vimeo Developer Docs](https://developer.vimeo.com/)
- [iOS AVFoundation](https://developer.apple.com/av-foundation/)
