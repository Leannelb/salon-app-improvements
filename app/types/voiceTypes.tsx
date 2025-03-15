import { Animated } from 'react-native';

export interface VoiceRecognitionProps {
  onResult: (text: string) => void;
  onNavigate?: () => void;
  voiceFeedback?: boolean;
}

export interface VoiceRecognitionReturn {
  text: string;
  isListening: boolean;
  pulseAnim: Animated.Value;
  toggleListening: () => Promise<void>;
  errorMessage: string | null;
  showConfirmation: boolean;
  handleConfirm: () => void;
  setShowConfirmation: (show: boolean) => void;
}
