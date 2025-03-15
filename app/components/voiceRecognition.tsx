import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text, IconButton, Portal, Modal, Button } from 'react-native-paper';
import { voiceRecognitionStyles as styles } from '../styles/voiceRecognitionStyles';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import { VoiceRecognitionProps } from '../types/voiceTypes';

export default function VoiceRecognition({
  onResult,
  onNavigate,
  voiceFeedback,
}: VoiceRecognitionProps) {
  const {
    text,
    isListening,
    pulseAnim,
    toggleListening,
    errorMessage,
    showConfirmation,
    handleConfirm,
    setShowConfirmation,
  } = useVoiceRecognition({ onResult, onNavigate, voiceFeedback });

  return (
    <View style={styles.container}>
      {text ? (
        <Text style={styles.transcript}>{text}</Text>
      ) : (
        <Text style={styles.instructionText}>{isListening ? 'Listening...' : 'Tap to speak'}</Text>
      )}

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[styles.micButton, isListening ? styles.micButtonActive : null]}
          onPress={toggleListening}
          activeOpacity={0.7}
        >
          <IconButton
            icon={isListening ? 'microphone-off' : 'microphone'}
            size={40}
            iconColor="#fff"
            style={styles.micIcon}
          />
        </TouchableOpacity>
      </Animated.View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Confirmation Modal */}
      <Portal>
        <Modal
          visible={showConfirmation}
          onDismiss={() => setShowConfirmation(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>I heard:</Text>
          <Text style={styles.modalText}>{text}</Text>
          <Text style={styles.modalQuestion}>Is this correct?</Text>

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setShowConfirmation(false);
                toggleListening();
              }}
              style={styles.modalButton}
            >
              Try Again
            </Button>

            <Button mode="contained" onPress={handleConfirm} style={styles.modalButton}>
              Yes, Continue
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
