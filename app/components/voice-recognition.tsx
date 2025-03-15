import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, TouchableOpacity, Animated } from 'react-native';
import { Text, IconButton, Portal, Modal, Button } from 'react-native-paper';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { voiceRecognitionStyles as styles } from '../styles/voiceRecognitionStyles';
// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type VoiceRecognitionProps = {
  onResult: (text: string) => void;
  onNavigate?: () => void;
  voiceFeedback?: boolean;
};

export default function VoiceRecognition({
  onResult,
  onNavigate,
  voiceFeedback = false,
}: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [webSpeechRecognition, setWebSpeechRecognition] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Animation for the pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Start pulsing animation when listening
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).stop();
    }
  }, [isListening, pulseAnim]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Setup Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setText(result);

          // Only call onResult when recognition is final
          if (event.results[0].isFinal) {
            if (onResult) {
              onResult(result);
              setShowConfirmation(true);
            }
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          setErrorMessage(`Error: ${event.error}`);
          setIsListening(false);
        };

        setWebSpeechRecognition(recognition);
      }
    } else {
      // Setup React Native Voice
      function onSpeechResults(e: any) {
        if (e.value && e.value.length > 0) {
          const recognizedText = e.value[0];
          setText(recognizedText);
          if (onResult) {
            onResult(recognizedText);
            setShowConfirmation(true);
          }
        }
      }

      function onSpeechError(e: any) {
        setErrorMessage(`Error: ${e.error?.message || 'Unknown error'}`);
        setIsListening(false);
      }

      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }
  }, [onResult, onNavigate]);

  const toggleListening = async () => {
    try {
      // Clear previous states
      setText('');
      setErrorMessage(null);
      setShowConfirmation(false);

      if (isListening) {
        if (Platform.OS === 'web') {
          webSpeechRecognition?.stop();
        } else {
          await Voice.stop();
        }
        setIsListening(false);
      } else {
        if (voiceFeedback) {
          Speech.speak('What would you like to do?', {
            rate: 0.9,
            pitch: 1.0,
            onDone: () => {
              startListening();
            },
          });
        } else {
          startListening();
        }
      }
    } catch (e) {
      console.error(e);
      setErrorMessage(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const startListening = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webSpeechRecognition) {
          webSpeechRecognition.start();
          setIsListening(true);
        } else {
          setErrorMessage('Speech recognition not supported in this browser');
        }
      } else {
        await Voice.start('en-US');
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
      setErrorMessage(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    if (onNavigate) {
      onNavigate();
    }
  };

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
