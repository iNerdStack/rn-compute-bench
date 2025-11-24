import MD5 from 'crypto-js/md5';

const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface BruteForceResult {
  found: boolean;
  plaintext: string;
  attempts: number;
  timeMs: number;
  checksPerSecond: number;
}

export interface BruteForceCallbacks {
  onProgress?: (attempts: number, current: string, checksPerSecond: number) => void;
  shouldCancel?: () => boolean;
}

/**
 * Pure JavaScript MD5 brute force implementation
 * Useful for performance comparison with native implementations
 */
export async function bruteForceHash(
  targetHash: string,
  maxLength: number,
  callbacks?: BruteForceCallbacks
): Promise<BruteForceResult> {
  const startTime = Date.now();
  let totalAttempts = 0;

  for (let length = 1; length <= maxLength; length++) {
    const result = await tryLength(
      targetHash,
      length,
      totalAttempts,
      callbacks,
      startTime
    );

    if (result?.found) {
      return result;
    }

    // Update attempts count from the failed attempt
    if (result) {
      totalAttempts = result.attempts;
    }
  }

  const elapsed = Date.now() - startTime;
  return {
    found: false,
    plaintext: '',
    attempts: totalAttempts,
    timeMs: elapsed,
    checksPerSecond: totalAttempts / (elapsed / 1000),
  };
}

async function tryLength(
  targetHash: string,
  length: number,
  startAttempts: number,
  callbacks?: BruteForceCallbacks,
  startTime?: number
): Promise<BruteForceResult> {
  const current = new Array(length).fill(0);
  let attempts = startAttempts;
  const batchSize = 1000; // Check cancellation every N attempts
  let hasMore = true;

  while (hasMore) {
    for (let i = 0; i < batchSize; i++) {
      const testStr = current.map(idx => CHARSET[idx]).join('');
      const hash = MD5(testStr).toString();
      attempts++;

      if (hash === targetHash) {
        const elapsed = Date.now() - (startTime || Date.now());
        return {
          found: true,
          plaintext: testStr,
          attempts,
          timeMs: elapsed,
          checksPerSecond: attempts / (elapsed / 1000),
        };
      }

      if (!incrementCombination(current, CHARSET.length)) {
        hasMore = false;
        break;
      }
    }

    // Check cancellation and update progress
    if (callbacks?.shouldCancel?.()) {
      const elapsed = Date.now() - (startTime || Date.now());
      return {
        found: false,
        plaintext: '',
        attempts,
        timeMs: elapsed,
        checksPerSecond: attempts / (elapsed / 1000),
      };
    }

    if (callbacks?.onProgress) {
      const elapsed = Date.now() - (startTime || Date.now());
      const checksPerSecond = attempts / (elapsed / 1000);
      const testStr = current.map(idx => CHARSET[idx]).join('');
      callbacks.onProgress(attempts, testStr, checksPerSecond);
    }

    // Yield to prevent blocking UI
    await new Promise<void>(resolve => setTimeout(resolve, 0));
  }

  // Exhausted this length without finding
  const elapsed = Date.now() - (startTime || Date.now());
  return {
    found: false,
    plaintext: '',
    attempts,
    timeMs: elapsed,
    checksPerSecond: attempts / (elapsed / 1000),
  };
}

function incrementCombination(current: number[], base: number): boolean {
  for (let i = current.length - 1; i >= 0; i--) {
    current[i]++;
    if (current[i] < base) {
      return true;
    }
    current[i] = 0;
  }
  return false;
}

/**
 * Generate MD5 hash from input string
 */
export function generateMd5(input: string): string {
  return MD5(input).toString();
}

/**
 * Cancel the brute force operation
 * Note: Use the shouldCancel callback in bruteForceHash instead
 */
export function cancelBruteForce(): void {
  // This is handled through the callbacks mechanism
  // Kept for API consistency with native modules
}

// Export as default object to match native module API
export default {
  bruteForceHash,
  generateMd5,
  cancelBruteForce,
};
