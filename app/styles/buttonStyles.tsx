import { StyleSheet } from 'react-native';
import { colors } from './globalColors';
import globalStyles from './globalStyles';

// Booking screen specific styles
export const buttonStyles = StyleSheet.create({
  voiceButton: {
    ...globalStyles.button,
    backgroundColor: colors.lightPurple,
  },
  regularButton: {
    ...globalStyles.button,
    backgroundColor: colors.mediumPurple,
  },
  manageButton: {
    ...globalStyles.button,
    backgroundColor: colors.darkPurple,
  },
  marginTop: {
    marginTop: 16,
  },
});
