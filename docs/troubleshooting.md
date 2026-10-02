# Troubleshooting

## iOS build fails with `error code 70`

Xcode downloads the iOS platform separately from the SDK, and an update leaves the old
runtime behind. Compare `xcrun simctl list runtimes` against
`xcodebuild -showsdks | grep iOS`; if the runtime is behind, run:

```bash
sudo xcodebuild -runFirstLaunch
xcodebuild -downloadPlatform iOS
```
