import Foundation
import Capacitor
import AVKit
import AVFoundation

@objc(VideoNativeBridgePlugin)
public class VideoNativeBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "VideoNativeBridgePlugin"
    public let jsName = "VideoNativeBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isNativePlayerActive", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPlayerState", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "play", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pause", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "seek", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setVolume", returnType: CAPPluginReturnPromise)
    ]

    private var videoPlayerDetector: VideoPlayerDetector?
    private var currentPlayer: AVPlayer?
    private var currentPlayerViewController: AVPlayerViewController?
    private var timeObserver: Any?

    override public func load() {
        super.load()
        videoPlayerDetector = VideoPlayerDetector(plugin: self)
        videoPlayerDetector?.startObserving()
    }

    deinit {
        videoPlayerDetector?.stopObserving()
        removeTimeObserver()
    }

    // MARK: - Public Methods

    @objc func isNativePlayerActive(_ call: CAPPluginCall) {
        let active = currentPlayerViewController != nil
        call.resolve(["active": active])
    }

    @objc func getPlayerState(_ call: CAPPluginCall) {
        guard let player = currentPlayer else {
            call.reject("No active player")
            return
        }

        let isPlaying = player.rate > 0 && player.error == nil
        let currentTime = CMTimeGetSeconds(player.currentTime())
        let duration = player.currentItem?.duration.seconds ?? 0

        call.resolve([
            "isPlaying": isPlaying,
            "currentTime": currentTime,
            "duration": duration
        ])
    }

    @objc func play(_ call: CAPPluginCall) {
        guard let player = currentPlayer else {
            call.reject("No active player")
            return
        }

        player.play()
        call.resolve()
    }

    @objc func pause(_ call: CAPPluginCall) {
        guard let player = currentPlayer else {
            call.reject("No active player")
            return
        }

        player.pause()
        call.resolve()
    }

    @objc func seek(_ call: CAPPluginCall) {
        guard let player = currentPlayer else {
            call.reject("No active player")
            return
        }

        guard let time = call.getDouble("time") else {
            call.reject("Time parameter is required")
            return
        }

        let cmTime = CMTime(seconds: time, preferredTimescale: 600)
        player.seek(to: cmTime) { finished in
            if finished {
                call.resolve()
            } else {
                call.reject("Seek was interrupted")
            }
        }
    }

    @objc func setVolume(_ call: CAPPluginCall) {
        guard let player = currentPlayer else {
            call.reject("No active player")
            return
        }

        guard let volume = call.getFloat("volume") else {
            call.reject("Volume parameter is required")
            return
        }

        player.volume = volume
        call.resolve()
    }

    // MARK: - Internal Methods

    internal func onPlayerOpened(player: AVPlayer, playerViewController: AVPlayerViewController) {
        currentPlayer = player
        currentPlayerViewController = playerViewController

        // Extract video information
        var data: [String: Any] = [
            "isPlaying": player.rate > 0
        ]

        if let urlAsset = player.currentItem?.asset as? AVURLAsset {
            data["url"] = urlAsset.url.absoluteString
        }

        if let duration = player.currentItem?.duration.seconds, !duration.isNaN {
            data["duration"] = duration
        }

        // Notify JavaScript
        notifyListeners("videoPlayerOpened", data: data)

        // Start monitoring playback state
        observePlayer(player)
    }

    internal func onPlayerClosed() {
        removeTimeObserver()
        currentPlayer = nil
        currentPlayerViewController = nil

        notifyListeners("videoPlayerClosed", data: [:])
    }

    // MARK: - Private Methods

    private func observePlayer(_ player: AVPlayer) {
        // Remove existing observer if any
        removeTimeObserver()

        // Add periodic time observer
        let interval = CMTime(seconds: 0.5, preferredTimescale: 600)
        timeObserver = player.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            guard let self = self else { return }

            let currentTime = CMTimeGetSeconds(time)
            let duration = player.currentItem?.duration.seconds ?? 0

            self.notifyListeners("videoTimeUpdated", data: [
                "currentTime": currentTime,
                "duration": duration
            ])
        }

        // Observe playback state changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(playerRateChanged),
            name: NSNotification.Name("AVPlayerRateDidChangeNotification"),
            object: player
        )
    }

    private func removeTimeObserver() {
        if let observer = timeObserver, let player = currentPlayer {
            player.removeTimeObserver(observer)
            timeObserver = nil
        }
    }

    @objc private func playerRateChanged(_ notification: Notification) {
        guard let player = notification.object as? AVPlayer else { return }

        let isPlaying = player.rate > 0
        let currentTime = CMTimeGetSeconds(player.currentTime())
        let duration = player.currentItem?.duration.seconds ?? 0

        notifyListeners("videoPlaybackStateChanged", data: [
            "isPlaying": isPlaying,
            "currentTime": currentTime,
            "duration": duration
        ])
    }
}
