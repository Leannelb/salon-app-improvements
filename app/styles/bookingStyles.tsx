import { StyleSheet } from 'react-native';
import globalStyles from './globalStyles';

// Booking screen specific styles
export const bookingStyles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  card: {
    marginBottom: 20,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#e3f2fd',
  },
  button: {
    ...globalStyles.button,
  },
});

export const bookingCompleteStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    backgroundColor: '#4CAF50',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    marginBottom: 24,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#4CAF50',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  reminderText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    marginVertical: 8,
    width: '100%',
  },
});

export const rescheduleBookingStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    marginBottom: 16,
    textAlign: 'center',
  },
  voiceAssistantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
  },
  speakButton: {
    marginLeft: 8,
  },
  bookingCard: {
    marginBottom: 20,
  },
  divider: {
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  detailValue: {
    fontWeight: 'bold',
  },
  alternativesTitle: {
    marginVertical: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  loadingText: {
    marginTop: 12,
  },
  noSlotsCard: {
    marginVertical: 16,
    backgroundColor: '#fff9c4',
  },
  noSlotsText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dateSection: {
    marginBottom: 16,
  },
  dateTitle: {
    marginBottom: 8,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeChip: {
    margin: 4,
  },
  selectedTimeChip: {
    backgroundColor: '#2196F3',
  },
  legendContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  confirmButton: {
    marginTop: 24,
    marginBottom: 12,
    paddingVertical: 8,
  },
  cancelButton: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});

export const bookingManagementStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    marginHorizontal: 4,
    flex: 1,
  },
  bookingsList: {
    paddingBottom: 80, // Space for the floating button
  },
  bookingCard: {
    marginBottom: 12,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    marginVertical: 2,
    color: '#555',
  },
  divider: {
    marginVertical: 8,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
  },
  price: {
    fontWeight: 'bold',
  },
  emptyCard: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  newBookingButton: {
    marginTop: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
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
