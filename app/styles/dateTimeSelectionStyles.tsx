import { StyleSheet } from 'react-native';

export const dateTimeSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginBottom: 16,
    textAlign: 'center',
  },
  voiceCard: {
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  voiceDetected: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  timeTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  timeChip: {
    margin: 4,
    backgroundColor: '#ffffff',
  },
  selectedTimeChip: {
    backgroundColor: '#2196F3',
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  unavailableTimeChip: {
    backgroundColor: '#f0f0f0',
  },
  loader: {
    marginVertical: 24,
  },
  noTimesMessage: {
    textAlign: 'center',
    marginVertical: 24,
    fontStyle: 'italic',
  },
  continueButton: {
    marginVertical: 24,
    paddingVertical: 8,
  },
});
