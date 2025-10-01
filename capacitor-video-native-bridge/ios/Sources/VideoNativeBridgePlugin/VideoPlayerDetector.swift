import Foundation
import AVKit
import UIKit

class VideoPlayerDetector {
    weak var plugin: VideoNativeBridgePlugin?
    private var playerViewController: AVPlayerViewController?

    init(plugin: VideoNativeBridgePlugin) {
        self.plugin = plugin
    }

    func startObserving() {
        // Observe window changes to detect AVPlayerViewController
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(windowDidBecomeVisible(_:)),
            name: UIWindow.didBecomeVisibleNotification,
            object: nil
        )

        // Observe when window becomes hidden
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(windowDidBecomeHidden(_:)),
            name: UIWindow.didBecomeHiddenNotification,
            object: nil
        )

        // Observe player item changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(playerItemBecameCurrent(_:)),
            name: NSNotification.Name("AVPlayerItemBecameCurrentNotification"),
            object: nil
        )
    }

    func stopObserving() {
        NotificationCenter.default.removeObserver(self)
    }

    @objc private func windowDidBecomeVisible(_ notification: Notification) {
        guard let window = notification.object as? UIWindow else { return }

        // Check if this is an AVPlayerViewController window
        if let playerVC = findPlayerViewController(in: window.rootViewController) {
            playerViewController = playerVC

            if let player = playerVC.player {
                plugin?.onPlayerOpened(player: player, playerViewController: playerVC)
            }
        }
    }

    @objc private func windowDidBecomeHidden(_ notification: Notification) {
        guard let window = notification.object as? UIWindow else { return }

        // Check if the hidden window contains our player
        if let playerVC = findPlayerViewController(in: window.rootViewController),
           playerVC === playerViewController {
            plugin?.onPlayerClosed()
            playerViewController = nil
        }
    }

    @objc private func playerItemBecameCurrent(_ notification: Notification) {
        // Additional detection method for when player items change
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [weak self] in
            guard let self = self else { return }

            // Check if there's a player view controller in the window hierarchy
            if let keyWindow = UIApplication.shared.windows.first(where: { $0.isKeyWindow }),
               let playerVC = self.findPlayerViewController(in: keyWindow.rootViewController),
               let player = playerVC.player,
               self.playerViewController == nil {

                self.playerViewController = playerVC
                self.plugin?.onPlayerOpened(player: player, playerViewController: playerVC)
            }
        }
    }

    // Helper method to recursively find AVPlayerViewController in view hierarchy
    private func findPlayerViewController(in viewController: UIViewController?) -> AVPlayerViewController? {
        guard let viewController = viewController else { return nil }

        if let playerVC = viewController as? AVPlayerViewController {
            return playerVC
        }

        // Check presented view controller
        if let presentedVC = viewController.presentedViewController {
            if let playerVC = findPlayerViewController(in: presentedVC) {
                return playerVC
            }
        }

        // Check child view controllers
        for child in viewController.children {
            if let playerVC = findPlayerViewController(in: child) {
                return playerVC
            }
        }

        return nil
    }
}
