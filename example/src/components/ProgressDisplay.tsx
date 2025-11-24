import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ProgressDisplayProps {
  mode: string;
  attempts: number;
  checksPerSecond: number;
  currentTest: string;
  showDetails?: boolean;
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  mode,
  attempts,
  checksPerSecond,
  currentTest,
  showDetails = true,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#dc2626" />
      <Text style={styles.title}>Processing...</Text>
      <Text style={styles.mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)} Execution</Text>
      
      {showDetails && attempts > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Attempts</Text>
            <Text style={styles.statValue}>{formatNumber(attempts)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Speed</Text>
            <Text style={styles.statValue}>{formatNumber(checksPerSecond)}/sec</Text>
          </View>
          {currentTest && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Testing</Text>
              <Text style={styles.statValueMono}>{currentTest}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 4,
  },
  mode: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  statsContainer: {
    width: '100%',
    marginTop: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statValueMono: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
});
