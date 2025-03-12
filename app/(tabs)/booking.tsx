// screens/booking.tsx
import { StyleSheet, View } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import VoiceRecognition from '../components/voice-recognition';
import { parseVoiceCommand, CommandResult } from '../utils/voice-command-parser';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Booking() {
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

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">Salon Voice Booking</Text>
          <Text variant="bodyMedium">
            Say a command like &quot;Book a haircut with John tomorrow at 2pm&quot;
          </Text>
        </Card.Content>
      </Card>

      <VoiceRecognition onResult={handleVoiceResult} />

      {lastCommand && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text variant="titleMedium">I heard:</Text>
            <Text>Intent: {lastCommand.intent || 'Unknown'}</Text>
            <Text>Service: {lastCommand.service || 'Not specified'}</Text>
            <Text>Stylist: {lastCommand.stylist || 'Not specified'}</Text>
            <Text>Date: {lastCommand.date?.toDateString() || 'Not specified'}</Text>
            <Text>Time: {lastCommand.time || 'Not specified'}</Text>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={() =>
          router.push({
            pathname: '/service-selection',
            params: {
              command: lastCommand
                ? JSON.stringify(lastCommand)
                : JSON.stringify({} as CommandResult),
            },
          })
        }
        style={styles.button}
      >
        Start Booking
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 20,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#e3f2fd',
  },
  button: {
    marginTop: 20,
  },
});
