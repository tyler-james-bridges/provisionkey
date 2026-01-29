import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { GuideStep } from '@/lib/types';

interface StepViewProps {
  step: GuideStep;
  stepNumber: number;
  totalSteps?: number;
}

export default function StepView({ step, stepNumber, totalSteps }: StepViewProps) {
  const progress = totalSteps ? (stepNumber / totalSteps) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {stepNumber} of {totalSteps}
        </Text>
      </View>

      {/* Step Content */}
      <View style={styles.stepContent}>
        {/* Step Number Circle */}
        <View style={styles.stepNumberContainer}>
          <View style={styles.stepNumberCircle}>
            <Text style={styles.stepNumberText}>{stepNumber}</Text>
          </View>
          {totalSteps && stepNumber < totalSteps && <View style={styles.stepConnector} />}
        </View>

        {/* Step Details */}
        <View style={styles.stepDetails}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepContentText}>{step.content}</Text>

          {/* Optional Tip */}
          {step.tip && (
            <View style={styles.tipContainer}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipLabel}>Tip</Text>
              </View>
              <Text style={styles.tipText}>{step.tip}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#2A2A3A',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#8888AA',
    textAlign: 'center',
  },
  stepContent: {
    flexDirection: 'row',
  },
  stepNumberContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#2A2A3A',
    marginTop: 4,
  },
  stepDetails: {
    flex: 1,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  stepContentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#CCCCDD',
    marginBottom: 12,
  },
  tipContainer: {
    backgroundColor: '#6C63FF15',
    borderLeftWidth: 3,
    borderLeftColor: '#6C63FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C63FF',
    textTransform: 'uppercase',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#CCCCDD',
  },
});
