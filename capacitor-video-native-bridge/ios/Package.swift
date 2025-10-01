// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VimeoCapacitorVideoNativeBridge",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "VideoNativeBridgePlugin",
            targets: ["VideoNativeBridgePlugin"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "VideoNativeBridgePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "Sources/VideoNativeBridgePlugin"
        )
    ]
)
