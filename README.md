# rn-compute-bench

[![npm version](https://img.shields.io/npm/v/rn-compute-bench.svg)](https://www.npmjs.com/package/rn-compute-bench)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CPU performance benchmarking library for React Native with MD5 brute-force implementations in JavaScript, Rust, and Kotlin.

## Overview

**rn-compute-bench** is a React Native library that enables developers to benchmark CPU-intensive operations across three different execution environments:

- **JavaScript** - Pure JS implementation
- **Rust** - Native high-performance implementation via [Craby](https://github.com/leegeunhyeok/craby)
- **Kotlin** - Native Android implementation with coroutines

Perfect for profiling device performance, comparing native vs JS execution, and testing CPU-bound workloads in production apps.

## Features

- **Type-Safe API** - Full TypeScript support with detailed types
- **Production Ready** - Optimized implementations with cancellation support
- **Example App Included** - Full-featured benchmark UI

## Installation

```bash
npm install rn-compute-bench
# or
yarn add rn-compute-bench
```

### Requirements

- React Native 0.76+ with New Architecture enabled
- Android: API Level 21+
- iOS: iOS 13+

## Usage

### Basic Example

```typescript
import {
  MD5BruteForceRust,
  MD5BruteForceKotlin,
  MD5BruteForceJS,
  type BruteForceResult,
} from 'rn-compute-bench';

// Using Rust implementation (fastest)
const result = await MD5BruteForceRust.bruteForceHash(
  '5d41402abc4b2a76b9719d911017c592', // MD5 hash of "hello"
  5 // max length to test
);

console.log(result);
// {
//   found: true,
//   plaintext: 'hello',
//   attempts: 123456,
//   timeMs: 45.2,
//   checksPerSecond: 2730000
// }

// Using Kotlin implementation (Android only)
const kotlinResult = await MD5BruteForceKotlin.bruteForceHash(
  '0cc175b9c0f1b6a831c399e269772661', // MD5 hash of "a"
  3
);

// Using JavaScript implementation (cross-platform)
const jsResult = await MD5BruteForceJS.bruteForceHash(
  'e4da3b7fbbce2345d7772b0674a318d5', // MD5 hash of "5"
  2,
  {
    onProgress: (attempts, current, checksPerSecond) => {
      console.log(`Tested: ${current}, Speed: ${checksPerSecond.toFixed(0)} checks/sec`);
    },
    shouldCancel: () => userRequestedCancel,
  }
);
```

### Generating MD5 Hashes

```typescript
// Rust
const hash = MD5BruteForceRust.generateMd5('hello');
// "5d41402abc4b2a76b9719d911017c592"

// Kotlin (Android only)
const hash = await MD5BruteForceKotlin.generateMd5('hello');

// JavaScript
const hash = MD5BruteForceJS.generateMd5('hello');
```

### Cancellation

```typescript
// Start brute force
const promise = MD5BruteForceRust.bruteForceHash(hash, 10);

// Cancel from another part of your code
MD5BruteForceRust.cancelBruteForce();

// JavaScript cancellation via callback
let shouldStop = false;
const jsPromise = MD5BruteForceJS.bruteForceHash(hash, 10, {
  shouldCancel: () => shouldStop,
});

// Later...
shouldStop = true;
```

## API Reference

### `MD5BruteForceRust`

High-performance Rust implementation

#### Methods

- **`bruteForceHash(targetHash: string, maxLength: number): Promise<BruteForceResult>`**

  Attempts to crack an MD5 hash by testing combinations up to `maxLength` characters.

- **`cancelBruteForce(): void`**

  Cancels the ongoing brute force operation.

- **`generateMd5(input: string): string`**

  Generates an MD5 hash from the input string.

### `MD5BruteForceKotlin` (Android only)

Native Kotlin implementation with coroutines.

#### Methods

Same as `MD5BruteForceRust` but:
- **`generateMd5(input: string): Promise<string>`** - Returns a promise

**Note**: Only available on Android.

### `MD5BruteForceJS`

Pure JavaScript implementation with progress callbacks.

#### Methods

- **`bruteForceHash(targetHash: string, maxLength: number, callbacks?: BruteForceCallbacks): Promise<BruteForceResult>`**

  JavaScript implementation with optional progress tracking.

  ```typescript
  interface BruteForceCallbacks {
    onProgress?: (attempts: number, current: string, checksPerSecond: number) => void;
    shouldCancel?: () => boolean;
  }
  ```

- **`generateMd5(input: string): string`**

### Types

```typescript
interface BruteForceResult {
  found: boolean;
  plaintext: string;
  attempts: number;
  timeMs: number;
  checksPerSecond: number;
}
```

**Character Set**: `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ` (62 characters)

## Example App

### Try the Pre-built Android APK

Don't want to build from source? Download and install the pre-built benchmark app:

**[Download APK](./releases/android/rn-compute-bench.apk)**

**Requirements**: Android 6.0 (API 23) or higher

See the [releases folder](./releases) for more details.

### Build from Source

Alternatively, build and run the example app yourself:

```bash
# Clone the repository
git clone https://github.com/iNerdstack/rn-compute-bench.git
cd rn-compute-bench

# Install dependencies
yarn install
cd example && yarn install && cd ..

# Run on Android
cd example && yarn android
```

The example app includes:
- Interactive hash input with presets
- Mode selector (JS/Rust/Kotlin)
- Real-time performance metrics
- Visual results comparison
- Example test hashes

## Use Cases

- **Device Profiling**: Measure CPU performance across different device models
- **Performance Testing**: Benchmark native vs JavaScript performance
- **Load Testing**: Test app behavior under CPU-intensive operations
- **Cross-Platform Comparison**: Compare iOS (Rust) vs Android (Rust/Kotlin) performance
- **Educational**: Learn about native module integration and performance optimization

## Development

### Building from Source

If you want to modify the native implementations:

```bash
# Prerequisites
# - Rust 1.82+ (https://rustup.rs/)
# - Android NDK (set ANDROID_NDK_HOME)

# Install dependencies
yarn install

# Generate Craby bindings
npx crabygen

# Build native modules
npx crabygen build

# Test changes
cd example && yarn android
```

### Project Structure

```
rn-compute-bench/
├── src/                          # TypeScript module exports
│   ├── index.ts                  # Main exports
│   ├── NativeBruteForceRust.ts   # Rust module spec
│   ├── BruteForceKotlin.ts       # Kotlin module interface
│   └── MD5BruteForceJS.ts        # JS implementation
├── crates/                       # Rust implementation
│   └── lib/src/
│       └── brute_force_rust_impl.rs
├── android/                      # Android native module
│   └── src/main/java/com/rncomputebench/
│       └── NativeBruteForceKotlinModule.kt
├── cpp/                          # C++ bridging (auto-generated)
└── example/                      # Example React Native app
    └── src/
        └── screens/BenchmarkScreen.tsx
```

## Contributing

Contributions are welcome! Ideas for improvements:

- Implement parallel processing optimizations
- Add performance visualization graphs
- Create benchmarking presets for common operations


## License

MIT License - See [LICENSE](./LICENSE) file for details.

## Author

**Nerd Stack**
- Email: isaacajetunmobi@gmail.com
- GitHub: [@iNerdstack](https://github.com/iNerdstack)

**Note**: This library is designed for performance testing and educational purposes.