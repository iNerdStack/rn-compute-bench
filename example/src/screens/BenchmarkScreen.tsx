import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  MD5BruteForceRust,
  MD5BruteForceKotlin,
  MD5BruteForceJS,
  type BruteForceResult,
  type BruteForceCallbacks
} from 'rn-compute-bench';
import { PlaintextInput } from '../components/PlaintextInput';
import { HashDisplay } from '../components/HashDisplay';
import { MaxLengthInput } from '../components/MaxLengthInput';
import { ModeSelector } from '../components/ModeSelector';
import { ProgressDisplay } from '../components/ProgressDisplay';
import { ResultDisplay } from '../components/ResultDisplay';

type ExecutionMode = 'javascript' | 'rust' | 'kotlin';

interface BenchmarkResultWithMode extends BruteForceResult {
  mode: ExecutionMode;
}

export const BenchmarkScreen = () => {
  const [plaintext, setPlaintext] = useState('');
  const [targetHash, setTargetHash] = useState('');
  const [maxLength, setMaxLength] = useState('3');
  const [mode, setMode] = useState<ExecutionMode>('kotlin');
  const [isRunning, setIsRunning] = useState(false);
  const [currentResult, setCurrentResult] = useState<BenchmarkResultWithMode | null>(null);
  const [progress, setProgress] = useState({ attempts: 0, current: '', checksPerSecond: 0 });
  const [showProgress, setShowProgress] = useState(false);
  
  const shouldCancelRef = useRef(false);

  const handlePlaintextChange = (text: string) => {
    setPlaintext(text);
    if (text) {
      const hash = MD5BruteForceJS.generateMd5(text);
      setTargetHash(hash);
      setMaxLength(text.length.toString());
    } else {
      setTargetHash('');
    }
  };

  const startBenchmark = async () => {
    if (!targetHash || !plaintext) return;

    setIsRunning(true);
    setCurrentResult(null);
    setProgress({ attempts: 0, current: '', checksPerSecond: 0 });
    shouldCancelRef.current = false;

    try {
      const maxLen = parseInt(maxLength, 10) || 3;
      let result: BruteForceResult;

      if (mode === 'rust') {
        result = await MD5BruteForceRust.bruteForceHash(targetHash, maxLen);
      } else if (mode === 'kotlin') {
        result = await MD5BruteForceKotlin.bruteForceHash(targetHash, maxLen);
      } else {
        // JavaScript mode
        result = await MD5BruteForceJS.bruteForceHash(
          targetHash,
          maxLen,
          {
            onProgress: showProgress ? (attempts, current, checksPerSecond) => {
              setProgress({ attempts, current, checksPerSecond });
            } : undefined,
            shouldCancel: () => shouldCancelRef.current,
          }
        );
      }

      const benchmarkResult: BenchmarkResultWithMode = {
        ...result,
        mode,
      };

      setCurrentResult(benchmarkResult);
    } catch (error) {
      console.error('Benchmark error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const stopBenchmark = () => {
    shouldCancelRef.current = true;
    if (mode === 'rust') {
      MD5BruteForceRust.cancelBruteForce();
    } else if (mode === 'kotlin') {
      MD5BruteForceKotlin.cancelBruteForce();
    }
    setIsRunning(false);
  };

  const canStart = plaintext && targetHash && !isRunning;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Compute Benchmark</Text>
          <Text style={styles.subtitle}>
            MD5 Brute Force Performance Benchmarks
          </Text>
        </View>

        <PlaintextInput
          value={plaintext}
          onChangeText={handlePlaintextChange}
          disabled={isRunning}
        />

        <HashDisplay hash={targetHash} />

        <MaxLengthInput
          value={maxLength}
          onChangeText={setMaxLength}
          disabled={isRunning}
        />

        <ModeSelector
          mode={mode}
          onModeChange={setMode}
          disabled={isRunning}
        />

        {mode === 'javascript' && (
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Show Live Progress</Text>
            <Text style={styles.toggleDescription}>
              Toggle off for faster JS execution (updates can slow it down)
            </Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowProgress(!showProgress)}
              disabled={isRunning}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleTrack, showProgress && styles.toggleTrackActive]}>
                <View style={[styles.toggleThumb, showProgress && styles.toggleThumbActive]} />
              </View>
              <Text style={styles.toggleText}>{showProgress ? 'On' : 'Off'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionContainer}>
          {!isRunning ? (
            <TouchableOpacity
              style={[styles.actionButton, !canStart && styles.actionButtonDisabled]}
              onPress={startBenchmark}
              disabled={!canStart}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Start Benchmark</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonStop]}
              onPress={stopBenchmark}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>

        {isRunning && (
          <ProgressDisplay
            mode={mode}
            attempts={progress.attempts}
            checksPerSecond={progress.checksPerSecond}
            currentTest={progress.current}
            showDetails={(mode === 'rust' || mode === 'kotlin') || showProgress}
          />
        )}

        {currentResult && <ResultDisplay result={currentResult} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    paddingTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonStop: {
    backgroundColor: '#4b5563',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1d5db',
    padding: 2,
  },
  toggleTrackActive: {
    backgroundColor: '#dc2626',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
});
