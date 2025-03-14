import { StyleSheet } from 'react-native';
import globalStyles from './globalStyles';

export const serviceSelectionStyles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  heading: {
    marginBottom: 16,
    textAlign: 'center',
  },
  voiceDetected: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  servicesList: {
    paddingBottom: 16,
  },
  serviceCard: {
    marginBottom: 12,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  duration: {
    color: '#666',
  },
  price: {
    fontWeight: 'bold',
  },
  continueButton: {
    ...globalStyles.button,
    paddingVertical: 8,
  },
});

// Export both the service-specific styles and the global styles
export { globalStyles };
