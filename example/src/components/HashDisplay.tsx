import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HashDisplayProps {
  hash: string;
}

export const HashDisplay: React.FC<HashDisplayProps> = ({ hash }) => {
  if (!hash) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Target MD5 Hash</Text>
      <View style={styles.hashContainer}>
        <Text style={styles.hash}>{hash}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  hashContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
  },
  hash: {
    fontSize: 13,
    color: '#4b5563',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
});
