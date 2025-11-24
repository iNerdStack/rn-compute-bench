import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BenchmarkResult {
  found: boolean;
  plaintext: string;
  attempts: number;
  timeMs: number;
  checksPerSecond: number;
  mode: string;
}

interface ResultDisplayProps {
  result: BenchmarkResult;
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const formatModeName = (mode: string): string => {
  switch (mode) {
    case 'javascript':
      return 'JavaScript';
    case 'rust':
      return 'Rust';
    case 'kotlin':
      return 'Kotlin';
    case 'swift':
      return 'Swift';
    default:
      return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Results</Text>
        <View style={[styles.badge, result.found ? styles.badgeSuccess : styles.badgeError]}>
          <Text style={styles.badgeText}>
            {result.found ? 'Found' : 'Not Found'}
          </Text>
        </View>
      </View>

      {result.found && (
        <View style={styles.plaintextContainer}>
          <Text style={styles.plaintextLabel}>Plaintext</Text>
          <Text style={styles.plaintextValue}>{result.plaintext}</Text>
        </View>
      )}

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Mode</Text>
          <Text style={styles.statValue}>
            {formatModeName(result.mode)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(result.timeMs)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Attempts</Text>
          <Text style={styles.statValue}>{formatNumber(result.attempts)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Speed</Text>
          <Text style={styles.statValue}>{formatNumber(result.checksPerSecond)}/s</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
  },
  badgeError: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  plaintextContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  plaintextLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  plaintextValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#dc2626',
    fontFamily: 'monospace',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 14,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
