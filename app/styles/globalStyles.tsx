import { StyleSheet } from 'react-native';

// Common styles that might be shared across components
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginTop: 20,
  },
  normalText: {
    fontWeight: 'normal',
  },
  dialogTitle: {
    fontWeight: '400', // slightly less bold than default
  },
  dialogContent: {
    fontWeight: 'normal',
  },
});

export default globalStyles;
