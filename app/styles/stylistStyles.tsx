import { StyleSheet } from 'react-native';

export const stylistStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  voiceDetected: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  stylistsList: {
    paddingBottom: 16,
  },
  stylistCard: {
    marginBottom: 12,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  stylistContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stylistImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  stylistInfo: {
    flex: 1,
  },
  experience: {
    color: '#666',
    marginBottom: 8,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  specialtyChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  buttonsContainer: {
    marginTop: 16,
  },
  anyButton: {
    marginBottom: 12,
  },
  continueButton: {
    paddingVertical: 8,
  },
});

export const serviceSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    marginTop: 16,
    paddingVertical: 8,
  },
});