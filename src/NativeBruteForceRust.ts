import type { NativeModule } from 'craby-modules';
import { NativeModuleRegistry } from 'craby-modules';

export interface BruteForceResult {
  found: boolean;
  plaintext: string;
  attempts: number;
  timeMs: number;
  checksPerSecond: number;
}

export interface Spec extends NativeModule {
  /**
   * Brute force MD5 hash
   * @param targetHash - The MD5 hash to crack
   * @param maxLength - Maximum string length to test
   * @returns Promise that resolves when hash is found or max length reached
   */
  bruteForceHash(
    targetHash: string,
    maxLength: number
  ): Promise<BruteForceResult>;

  /**
   * Cancel ongoing brute force operation
   */
  cancelBruteForce(): void;

  /**
   * Generate MD5 hash from input string
   */
  generateMd5(input: string): string;
}

export default NativeModuleRegistry.getEnforcing<Spec>('BruteForceRust');
