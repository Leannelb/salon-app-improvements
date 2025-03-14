import { StyleSheet } from 'react-native';

export const voiceRecognitionStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  transcript: {
    marginVertical: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  instructionText: {
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
  micButton: {
    backgroundColor: '#6A1B9A',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  micButtonActive: {
    backgroundColor: '#E53935',
  },
  micIcon: {
    margin: 0,
  },
  errorText: {
    marginTop: 20,
    color: '#D32F2F',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    margin: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalQuestion: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
