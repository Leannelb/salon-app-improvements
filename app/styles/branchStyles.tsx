import { StyleSheet } from 'react-native';

export const branchStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  branchesList: {
    paddingBottom: 16,
  },
  branchCard: {
    marginBottom: 16,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  cardImage: {
    height: 140,
  },
  address: {
    marginBottom: 4,
  },
  phone: {
    color: '#666',
    marginBottom: 4,
  },
  distance: {
    color: '#009688',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  featureChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  continueButton: {
    marginVertical: 16,
    paddingVertical: 8,
  },
});
