import { View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import VoiceRecognition from '../components/voiceRecognition';
import { CommandResult } from '../utils/voice-command-parser';
import { useBooking } from '../hooks/useBooking';
import { bookingStyles } from '../styles/bookingStyles';
import CustomButton from '../components/customButton';

export default function Booking() {
  const { lastCommand, handleVoiceResult, router } = useBooking();

  return (
    <View style={bookingStyles.container}>
      <Card style={bookingStyles.card}>
        <Card.Content>
          <Text variant="headlineMedium">Salon Voice Booking</Text>
          <Text variant="bodyMedium">
            Say a command like &quot;Book a haircut with John tomorrow at 2pm&quot;
          </Text>
        </Card.Content>
      </Card>

      <VoiceRecognition onResult={handleVoiceResult} />

      {lastCommand && (
        <Card style={bookingStyles.resultCard}>
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
      <CustomButton
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
        style={bookingStyles.button}
        buttonText="Start Booking"
      />
    </View>
  );
}
