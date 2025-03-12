import { StyleSheet } from 'react-native';
import { colors } from './colors';

// Common styles that might be shared across components
const commonStyles = StyleSheet.create({
  button: {
    fontSize: 18,
    width: '80%',
    maxWidth: 300,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
});

// Booking screen specific styles
export const buttonStyles = StyleSheet.create({
  voiceButton: {
    ...commonStyles.button,
    backgroundColor: colors.lightPurple,
  },
  regularButton: {
    ...commonStyles.button,
    backgroundColor: colors.mediumPurple,
  },
  manageButton: {
    ...commonStyles.button,
    backgroundColor: colors.darkPurple,
  },
  marginTop: {
    marginTop: 16,
  },
});
