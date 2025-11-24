import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface MaxLengthInputProps {
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
}

export const MaxLengthInput: React.FC<MaxLengthInputProps> = ({
  value,
  onChangeText,
  disabled = false,
}) => {
  const lengthValue = parseInt(value) || 1;
  const isHigh = lengthValue > 5;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Maximum Length</Text>
      <Text style={styles.description}>
        Maximum characters to test (1-5 recommended)
      </Text>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        placeholder="3"
        editable={!disabled}
        maxLength={2}
      />
      {isHigh && (
        <Text style={styles.warning}>
          Warning: Values above 5 may take very long to complete
        </Text>
      )}
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
    width: 100,
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  warning: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 8,
    lineHeight: 16,
  },
});
