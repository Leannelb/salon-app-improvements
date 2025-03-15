import React from 'react';
import { View } from 'react-native';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { bookingCompleteStyles as styles } from '../styles/bookingStyles';

export default function BookingComplete() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Avatar.Icon icon="check-circle" size={120} style={styles.successIcon} color="#fff" />

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.heading}>
            Booking Confirmed!
          </Text>

          <Text style={styles.message}>
            Your appointment has been successfully booked. We&apos;ve sent a confirmation email with
            all the details.
          </Text>

          <Text style={styles.reminderText}>
            Please arrive 10 minutes before your appointment time.
          </Text>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={() => router.push('/(tabs)/booking')} style={styles.button}>
        Book Another Appointment
      </Button>
      <Button
        mode="outlined"
        onPress={() => {
          // In a real app, this would navigate to a bookings management screen
          router.push('/screens/booking-management');
        }}
        style={styles.button}
      >
        View My Bookings
      </Button>
    </View>
  );
}
