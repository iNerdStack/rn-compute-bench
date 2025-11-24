import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface PlaintextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
}

const TEST_VALUES = ['5', 'a', 'ab', 'zzz', 'hello'];

export const PlaintextInput: React.FC<PlaintextInputProps> = ({
  value,
  onChangeText,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Target Plaintext</Text>
      <Text style={styles.description}>
        Enter the text to search for (1-5 characters recommended)
      </Text>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder="e.g., hello"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
      />
      <View style={styles.quickTestsContainer}>
        <Text style={styles.quickTestsLabel}>Quick tests:</Text>
        <View style={styles.quickTestsButtons}>
          {TEST_VALUES.map(text => (
            <TouchableOpacity
              key={text}
              style={[styles.quickTestButton, disabled && styles.quickTestButtonDisabled]}
              onPress={() => onChangeText(text)}
              disabled={disabled}
            >
              <Text style={styles.quickTestText}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 10,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  quickTestsContainer: {
    marginTop: 12,
  },
  quickTestsLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  quickTestsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTestButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickTestButtonDisabled: {
    opacity: 0.5,
  },
  quickTestText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
});
