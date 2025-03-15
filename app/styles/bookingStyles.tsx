import { StyleSheet } from 'react-native';

// Common styles that might be shared across components
const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginTop: 20,
  },
  //common styles go here
});

// Booking screen specific styles
export const bookingStyles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  card: {
    marginBottom: 20,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#e3f2fd',
  },
  button: {
    ...commonStyles.button,
  },
});

export const homepageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  resultCard: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#e3f2fd',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultScroll: {
    maxHeight: 150,
  },
  resultItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalButton: {
    marginTop: 20,
    width: '100%',
  },
});

// Service selection screen specific styles
export const serviceSelectionStyles = StyleSheet.create({
  container: {
    ...commonStyles.container,
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

export const bookingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 4,
  },
  divider: {
    marginVertical: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  formCard: {
    marginBottom: 16,
  },
  input: {
    marginVertical: 4,
  },
  cardRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRowInput: {
    flex: 1,
  },
  confirmButton: {
    marginVertical: 24,
    paddingVertical: 8,
  },
});