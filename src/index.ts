// Export all benchmark implementations with clear naming
export { default as MD5BruteForceRust } from './NativeBruteForceRust';
export { default as MD5BruteForceKotlin } from './BruteForceKotlin';
import MD5BruteForceJSModule from './MD5BruteForceJS';
export const MD5BruteForceJS = MD5BruteForceJSModule;

// Re-export shared types
export type { BruteForceResult } from './NativeBruteForceRust';
export type { BruteForceCallbacks } from './MD5BruteForceJS';
