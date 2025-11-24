import { NativeModules, Platform } from 'react-native';

export interface BruteForceResult {
  found: boolean;
  plaintext: string;
  attempts: number;
  timeMs: number;
  checksPerSecond: number;
}

interface Spec {
  bruteForceHash(
    targetHash: string,
    maxLength: number
  ): Promise<BruteForceResult>;
  cancelBruteForce(): void;
  generateMd5(input: string): Promise<string>;
}

// Lazy load to avoid module initialization errors at import time
let _module: Spec | null = null;

const getModule = (): Spec => {
  if (!_module) {
    if (Platform.OS !== 'android') {
      throw new Error('BruteForceKotlin is only available on Android');
    }

    _module = NativeModules.BruteForceKotlin as Spec;

    if (!_module) {
      throw new Error(
        'BruteForceKotlin module not found. Make sure the native module is properly linked.'
      );
    }
  }
  return _module;
};

export default {
  bruteForceHash: (targetHash: string, maxLength: number) =>
    getModule().bruteForceHash(targetHash, maxLength),
  cancelBruteForce: () => getModule().cancelBruteForce(),
  generateMd5: (input: string) => getModule().generateMd5(input),
};
