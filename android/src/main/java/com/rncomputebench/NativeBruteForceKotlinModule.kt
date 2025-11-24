package com.rncomputebench.lib

import com.facebook.react.bridge.*
import kotlinx.coroutines.*
import java.security.MessageDigest

class NativeBruteForceKotlinModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "BruteForceKotlin"
        const val CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }

    private var bruteForceJob: Job? = null
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    override fun getName(): String = NAME

    @ReactMethod
    fun bruteForceHash(targetHash: String, maxLength: Int, promise: Promise) {
        // Cancel any existing job
        bruteForceJob?.cancel()

        bruteForceJob = coroutineScope.launch {
            try {
                val result = performBruteForce(targetHash, maxLength)
                promise.resolve(result)
            } catch (e: CancellationException) {
                val errorResult = Arguments.createMap().apply {
                    putBoolean("found", false)
                    putString("plaintext", "")
                    putDouble("attempts", 0.0)
                    putDouble("timeMs", 0.0)
                    putDouble("checksPerSecond", 0.0)
                }
                promise.resolve(errorResult)
            } catch (e: Exception) {
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun cancelBruteForce() {
        bruteForceJob?.cancel()
    }

    @ReactMethod
    fun generateMd5(input: String, promise: Promise) {
        try {
            val md = MessageDigest.getInstance("MD5")
            val digest = md.digest(input.toByteArray())
            val hash = digest.joinToString("") { "%02x".format(it) }
            promise.resolve(hash)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    private suspend fun performBruteForce(targetHash: String, maxLength: Int): WritableMap {
        val startTime = System.currentTimeMillis()
        var attempts = 0L

        for (length in 1..maxLength) {
            val result = tryLength(targetHash, length, attempts, startTime)
            if (result != null && result.getBoolean("found")) {
                return result
            }
            attempts += countCombinations(length)

            // Check cancellation
            if (bruteForceJob?.isCancelled == true) {
                break
            }
        }

        // Not found
        val elapsed = System.currentTimeMillis() - startTime
        return Arguments.createMap().apply {
            putBoolean("found", false)
            putString("plaintext", "")
            putDouble("attempts", attempts.toDouble())
            putDouble("timeMs", elapsed.toDouble())
            putDouble("checksPerSecond", if (elapsed > 0) attempts.toDouble() / (elapsed / 1000.0) else 0.0)
        }
    }

    private suspend fun tryLength(
        targetHash: String,
        length: Int,
        startAttempts: Long,
        startTime: Long
    ): WritableMap? {
        val current = IntArray(length) { 0 }
        var attempts = startAttempts
        val md = MessageDigest.getInstance("MD5")
        val testBytes = ByteArray(length)

        // Pre-convert target hash to bytes for faster comparison
        val targetBytes = targetHash.chunked(2)
            .map { it.toInt(16).toByte() }
            .toByteArray()

        while (true) {
            // Check for cancellation periodically to allow cooperative cancellation
            if (attempts % 500000L == 0L) {
                yield()
            }

            // Build test bytes efficiently
            for (i in 0 until length) {
                testBytes[i] = CHARSET[current[i]].code.toByte()
            }

            // Compute MD5 hash
            md.reset()
            val digest = md.digest(testBytes)
            attempts++

            // Fast byte comparison instead of string comparison
            if (digest.contentEquals(targetBytes)) {
                // Only convert to string when we found the match
                val testStr = String(testBytes)
                val elapsed = System.currentTimeMillis() - startTime
                return Arguments.createMap().apply {
                    putBoolean("found", true)
                    putString("plaintext", testStr)
                    putDouble("attempts", attempts.toDouble())
                    putDouble("timeMs", elapsed.toDouble())
                    putDouble("checksPerSecond", if (elapsed > 0) attempts.toDouble() / (elapsed / 1000.0) else 0.0)
                }
            }

            // Increment combination
            if (!incrementCombination(current, CHARSET.length)) {
                break
            }
        }

        return null
    }

    private fun incrementCombination(current: IntArray, base: Int): Boolean {
        for (i in current.indices.reversed()) {
            current[i]++
            if (current[i] < base) {
                return true
            }
            current[i] = 0
        }
        return false
    }

    private fun countCombinations(length: Int): Long {
        var count = 1L
        repeat(length) {
            count *= CHARSET.length
        }
        return count
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        coroutineScope.cancel()
    }
}
