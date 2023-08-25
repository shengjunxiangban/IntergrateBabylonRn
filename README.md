# Getting Started with IntergrateBabylonRn

This sample repo is intended to help users get started using IntergrateBabylonRn to create React Native applications using Babylon.js.

## Required Tools
- [node.js](https://nodejs.org/)
- Android
    - [Android Studio](https://developer.android.com/studio/)
- iOS
    - [Xcode](https://developer.apple.com/xcode/resources/)
    - [cocoapods](https://cocoapods.org/)

## 1. Setup React Native Development Environment

Follow the instructions on [React Native's documentation for setting up your development environment](https://reactnative.dev/docs/environment-setup/). Be sure to select "React Native CLI quickstart" instead of "Expo CLI quickstart" since we currently do not support the usage of Expo. 

## 2. Clone the Repo 

```
https://github.com/shengjunxiangban/IntergrateBabylonRn.git
```

## 3. Project Setup

From the repo root folder, restore the npm packages by running:

```
cd intergrateBabylonRn
npm install
```

### iOS Only 

When building for iOS, it will also be required to install the pods for the project. Go to the iOS project folder and run `pod install`.

```
cd ios
export NODE_BINARY="/Users/yangxiaolong/.nvm/versions/node/v16.20.2/bin/node"  -----.xcode.env.local change yours node version
pod install
```
## 4. Try It Out

From your repo root folder, run:

```
open interggrate.xcworkspace
```

## More Information

[How to create this project from scratch](CREATE.md)

## Additional Documentation

[Babylon React Native](https://github.com/BabylonJS/BabylonReactNative)
