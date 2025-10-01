// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VimeoCapacitorPlayer",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "VimeoCapacitorPlayerPlugin",
            targets: ["imeoCapacitorPlayerPlugin"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "imeoCapacitorPlayerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "Sources/imeoCapacitorPlayerPlugin"
        )
    ]
)
