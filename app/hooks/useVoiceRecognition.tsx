import { useState, useEffect, useRef } from 'react';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { Animated, Platform } from 'react-native';
import { VoiceRecognitionProps, VoiceRecognitionReturn } from '../types/voiceTypes';

// Define Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function useVoiceRecognition({
  onResult,
  onNavigate,
  voiceFeedback = false,
}: VoiceRecognitionProps): VoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [webSpeechRecognition, setWebSpeechRecognition] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Animation for the pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const handleSpeechResults = (e: any) => {
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0];
      setText(recognizedText);
      onResult(recognizedText);
      setShowConfirmation(true);
    }
  };

  const handleSpeechError = (e: any) => {
    setErrorMessage(`Error: ${e.error?.message || 'Unknown error'}`);
    setIsListening(false);
  };

  const startPulseAnimation = () => {
    pulseAnimation.current = Animated.loop(
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
    );
    pulseAnimation.current.start();
  };

  const stopPulseAnimation = () => {
    if (pulseAnimation.current) {
      pulseAnimation.current.stop();
      pulseAnim.setValue(1);
    }
  };

  const setupWebSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setText(result);

          if (event.results[0].isFinal) {
            onResult(result);
            setShowConfirmation(true);
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
    }
  };

  const setupNativeVoiceRecognition = () => {
    Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechError = handleSpeechError;
  };

  // Single useEffect to handle all side effects
  useEffect(() => {
    // Setup speech recognition based on platform
    if (Platform.OS === 'web') {
      setupWebSpeechRecognition();
    } else {
      setupNativeVoiceRecognition();
    }

    // Handle animation based on listening state
    if (isListening) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }

    // Cleanup function
    return () => {
      stopPulseAnimation();
      if (Platform.OS !== 'web') {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, [isListening, onResult]);

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
      if (e instanceof Error) {
        setErrorMessage(`Error: ${e.message}`);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };

  const toggleListening = async () => {
    try {
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
      if (e instanceof Error) {
        setErrorMessage(`Error: ${e.message}`);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    if (onNavigate) {
      onNavigate();
    }
  };

  return {
    text,
    isListening,
    pulseAnim,
    toggleListening,
    errorMessage,
    showConfirmation,
    handleConfirm,
    setShowConfirmation,
  };
}
