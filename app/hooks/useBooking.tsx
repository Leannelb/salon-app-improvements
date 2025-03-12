import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { parseVoiceCommand, CommandResult } from '../utils/voice-command-parser';
import { Dimensions } from 'react-native';

export function useBooking() {
  const [lastCommand, setLastCommand] = useState<CommandResult | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const router = useRouter();

  const handleVoiceResult = (text: string) => {
    const parsedCommand = parseVoiceCommand(text);
    setLastCommand(parsedCommand);
    setShouldNavigate(parsedCommand.intent === 'booking');
  };

  useEffect(() => {
    if (shouldNavigate && lastCommand) {
      router.push({
        pathname: '/service-selection',
        params: {
          command: JSON.stringify(lastCommand),
        },
      });
      setShouldNavigate(false);
    }
  }, [shouldNavigate, lastCommand]);
  return {
    lastCommand,
    handleVoiceResult,
    router,
  };
}

export function useIndexHook() {
  const [lastCommand, setLastCommand] = useState<CommandResult | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 380;

  // Handle voice command results
  const handleVoiceResult = (text: string) => {
    const parsedCommand = parseVoiceCommand(text);
    setLastCommand(parsedCommand);
    setShouldNavigate(parsedCommand.intent === 'booking');
  };

  // Navigate based on voice command
  useEffect(() => {
    if (shouldNavigate && lastCommand) {
      // Close the modal first
      setVoiceModalVisible(false);

      // Short delay to allow modal to close before navigation
      setTimeout(() => {
        router.push({
          pathname: '/service-selection',
          params: {
            command: JSON.stringify(lastCommand),
          },
        });
      }, 300);

      setShouldNavigate(false);
    }
  }, [shouldNavigate, lastCommand]);
  return {
    setVoiceModalVisible,
    isSmallScreen,
    voiceModalVisible,
    handleVoiceResult,
    lastCommand,
    router,
  };
}
