import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ExecutionMode = 'javascript' | 'rust' | 'kotlin';

interface ModeSelectorProps {
  mode: ExecutionMode;
  onModeChange: (mode: ExecutionMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onModeChange,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Execution Mode</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            mode === 'javascript' && styles.buttonActive,
            disabled && styles.buttonDisabled,
          ]}
          onPress={() => onModeChange('javascript')}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, mode === 'javascript' && styles.buttonTextActive]}>
            JavaScript
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            mode === 'rust' && styles.buttonActive,
            disabled && styles.buttonDisabled,
          ]}
          onPress={() => onModeChange('rust')}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, mode === 'rust' && styles.buttonTextActive]}>
            Rust
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            mode === 'kotlin' && styles.buttonActive,
            disabled && styles.buttonDisabled,
          ]}
          onPress={() => onModeChange('kotlin')}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, mode === 'kotlin' && styles.buttonTextActive]}>
            Kotlin
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>
        Compare JavaScript vs Rust (via Craby) vs Kotlin (native Android)
      </Text>
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
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  buttonActive: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  buttonTextActive: {
    color: '#dc2626',
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 16,
  },
});
