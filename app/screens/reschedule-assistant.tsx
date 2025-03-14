// screens/reschedule-assistant.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Chip,
  Divider,
  Switch,
  IconButton,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { rescheduleBookingStyles } from '../styles/bookingStyles';

// Types
type Booking = {
  id: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  branchId: string;
  branchName: string;
  date: string;
  time: string;
  status: string;
  price: number;
};

type TimeSlot = {
  date: string;
  time: string;
  timeDifference: number;
  available: boolean;
  isSameStylist: boolean;
  isSimilarTime: boolean;
};

// Mock bookings data (same as in booking-management.tsx)
const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    serviceId: '1',
    serviceName: 'Haircut',
    stylistId: '1',
    stylistName: 'John',
    branchId: 'southside',
    branchName: 'Southside Salon',
    date: '2025-03-15',
    time: '10:00',
    status: 'confirmed',
    price: 35,
  },
  {
    id: 'booking-2',
    serviceId: '2',
    serviceName: 'Coloring',
    stylistId: '2',
    stylistName: 'Sarah',
    branchId: 'northside',
    branchName: 'Northside Studio',
    date: '2025-03-20',
    time: '14:30',
    status: 'confirmed',
    price: 80,
  },
];

// Generate alternative slots intelligently
const generateAlternatives = (booking: Booking): TimeSlot[] => {
  const alternatives: TimeSlot[] = [];
  const currentDate = new Date(booking.date);
  const [currentHour, currentMinute] = booking.time.split(':').map(Number);
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Generate slots for the next 7 days
  for (let i = 1; i <= 7; i++) {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + i);
    const dateString = newDate.toISOString().split('T')[0];

    // Generate slots around original time (+/- 2 hours)
    const minHour = Math.max(9, currentHour - 2);
    const maxHour = Math.min(17, currentHour + 2);

    for (let hour = minHour; hour <= maxHour; hour++) {
      for (let minute of [0, 30]) {
        // Skip some slots randomly for realism
        if (Math.random() > 0.7) continue;

        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const timeInMinutes = hour * 60 + minute;
        const timeDifference = Math.abs(timeInMinutes - currentTimeInMinutes);

        alternatives.push({
          date: dateString,
          time,
          timeDifference,
          available: true,
          isSameStylist: true, // In a real app, this would be checked
          isSimilarTime: timeDifference <= 60, // Within an hour of original time
        });
      }
    }
  }

  // Sort by their suitability (prefer similar times)
  return alternatives.sort((a, b) => a.timeDifference - b.timeDifference).slice(0, 12); // Limit to a reasonable number
};

export default function RescheduleAssistant() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [alternatives, setAlternatives] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Voice assistant options
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    // Find the requested booking
    const foundBooking = mockBookings.find((b) => b.id === bookingId);
    setBooking(foundBooking || null);

    if (foundBooking) {
      // Generate alternatives with a slight delay to simulate loading
      setTimeout(() => {
        const slots = generateAlternatives(foundBooking);
        setAlternatives(slots);
        setLoading(false);
      }, 1500);
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  // Handle toggling voice assistant
  const toggleVoiceAssistant = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);

    if (newState && booking) {
      // Speak the welcome message when enabling
      speakWithAssistant(
        `I'll help you reschedule your ${booking.serviceName} appointment. I've found ${alternatives.length} available times for you. Please select a new time.`,
      );
    } else {
      // Stop speaking if turning off
      Speech.stop();
    }
  };

  // Speak using the assistant (only if enabled)
  const speakWithAssistant = (message: string) => {
    if (voiceEnabled) {
      Speech.speak(message, {
        rate: 0.9,
        pitch: 1.0,
        voice: 'com.apple.voice.enhanced.en-US.Samantha', // Try to use enhanced voice if available
      });
    }
  };

  // Handle slot selection
  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);

    if (voiceEnabled) {
      speakWithAssistant(`Selected ${formatDate(slot.date)} at ${slot.time}`);
    }
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (!selectedSlot || !booking) return;

    setProcessing(true);

    if (voiceEnabled) {
      speakWithAssistant(
        `Rescheduling your ${booking.serviceName} appointment to ${formatDate(selectedSlot.date)} at ${selectedSlot.time}.`,
      );
    }

    // Simulate API call
    setTimeout(() => {
      setProcessing(false);

      // Show success alert
      Alert.alert(
        'Appointment Rescheduled',
        'Your appointment has been successfully rescheduled.',
        [{ text: 'OK', onPress: () => router.replace('/screens/booking-management') }],
      );
    }, 1500);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // If booking not found
  if (!booking) {
    return (
      <View style={rescheduleBookingStyles.container}>
        <Text variant="bodyLarge">Booking not found</Text>
        <Button mode="contained" onPress={() => router.back()} style={rescheduleBookingStyles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={rescheduleBookingStyles.container}>
      <Text variant="headlineMedium" style={rescheduleBookingStyles.heading}>
        Intelligent Rescheduling
      </Text>

      {/* Voice Assistant Toggle */}
      <View style={rescheduleBookingStyles.voiceAssistantContainer}>
        <Text variant="bodyMedium">Voice Assistant</Text>
        <Switch value={voiceEnabled} onValueChange={toggleVoiceAssistant} color="#6A1B9A" />
        {voiceEnabled && (
          <IconButton
            icon="volume-high"
            size={24}
            onPress={() =>
              speakWithAssistant(
                `I'll help you reschedule your ${booking.serviceName} appointment. I've found ${alternatives.length} available times for you.`,
              )
            }
            style={rescheduleBookingStyles.speakButton}
          />
        )}
      </View>

      <Card style={rescheduleBookingStyles.bookingCard}>
        <Card.Content>
          <Text variant="titleLarge">Current Appointment</Text>
          <Divider style={rescheduleBookingStyles.divider} />

          <View style={rescheduleBookingStyles.detailRow}>
            <Text variant="bodyMedium">Service:</Text>
            <Text variant="bodyMedium" style={rescheduleBookingStyles.detailValue}>
              {booking.serviceName}
            </Text>
          </View>

          <View style={rescheduleBookingStyles.detailRow}>
            <Text variant="bodyMedium">Date:</Text>
            <Text variant="bodyMedium" style={rescheduleBookingStyles.detailValue}>
              {formatDate(booking.date)}
            </Text>
          </View>

          <View style={rescheduleBookingStyles.detailRow}>
            <Text variant="bodyMedium">Time:</Text>
            <Text variant="bodyMedium" style={rescheduleBookingStyles.detailValue}>
              {booking.time}
            </Text>
          </View>

          <View style={rescheduleBookingStyles.detailRow}>
            <Text variant="bodyMedium">Stylist:</Text>
            <Text variant="bodyMedium" style={rescheduleBookingStyles.detailValue}>
              {booking.stylistName}
            </Text>
          </View>

          <View style={rescheduleBookingStyles.detailRow}>
            <Text variant="bodyMedium">Location:</Text>
            <Text variant="bodyMedium" style={rescheduleBookingStyles.detailValue}>
              {booking.branchName}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={rescheduleBookingStyles.alternativesTitle}>
        Recommended Alternatives
      </Text>

      {loading ? (
        <View style={rescheduleBookingStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text variant="bodyMedium" style={rescheduleBookingStyles.loadingText}>
            Finding available slots...
          </Text>
        </View>
      ) : alternatives.length === 0 ? (
        <Card style={rescheduleBookingStyles.noSlotsCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={rescheduleBookingStyles.noSlotsText}>
              No alternative slots available. Please try again later.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <View>
          {/* Group by date */}
          {Array.from(new Set(alternatives.map((slot) => slot.date))).map((dateString) => (
            <View key={dateString} style={rescheduleBookingStyles.dateSection}>
              <Text variant="titleMedium" style={rescheduleBookingStyles.dateTitle}>
                {formatDate(dateString)}
              </Text>

              <View style={rescheduleBookingStyles.timeSlotContainer}>
                {alternatives
                  .filter((slot) => slot.date === dateString)
                  .map((slot) => (
                    <Chip
                      key={`${slot.date}-${slot.time}`}
                      selected={
                        selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                      }
                      onPress={() => handleSelectSlot(slot)}
                      style={[
                        rescheduleBookingStyles.timeChip,
                        selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                          ? rescheduleBookingStyles.selectedTimeChip
                          : null,
                      ]}
                      selectedColor="#fff"
                    >
                      {slot.time}
                      {slot.isSimilarTime && '★'}
                    </Chip>
                  ))}
              </View>
            </View>
          ))}

          <View style={rescheduleBookingStyles.legendContainer}>
            <Text variant="bodySmall">★ Similar to your original time</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleConfirm}
            disabled={!selectedSlot || processing}
            loading={processing}
            style={rescheduleBookingStyles.confirmButton}
          >
            {processing ? 'Processing...' : 'Confirm New Time'}
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            disabled={processing}
            style={rescheduleBookingStyles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      )}
    </ScrollView>
  );
}
