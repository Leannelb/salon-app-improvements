// screens/date-time-selection.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Button, Title, Chip, ActivityIndicator } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CommandResult } from '../utils/voice-command-parser';

// Types
type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

type DateData = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

// Mock data generation for available slots
const generateTimeSlots = (date: string): TimeSlot[] => {
  // In a real app, this would call an API to get available slots
  const slots: TimeSlot[] = [];
  // Business hours: 9am - 5pm
  const startHour = 9;
  const endHour = 17;

  // Random availability - in real app would be from backend
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Format time as HH:MM
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      // Random availability (70% chance of being available)
      const isAvailable = Math.random() < 0.7;

      slots.push({
        id: `${date}-${timeString}`,
        time: timeString,
        available: isAvailable,
      });
    }
  }

  return slots;
};

export default function DateTimeSelection() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const serviceId = params.serviceId as string;
  const stylistId = params.stylistId as string;
  const command = params.command ? (JSON.parse(params.command as string) as CommandResult) : null;

  // If date was mentioned in voice command, parse it
  const initialDate = command?.date ? new Date(command.date) : new Date();

  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
  );

  const [selectedTime, setSelectedTime] = useState<string | null>(command?.time || null);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Set up min date (today) and max date (3 months from now)
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Load time slots when date changes
  useEffect(() => {
    setLoading(true);
    setSelectedTime(null);

    // Simulate API call delay
    setTimeout(() => {
      const slots = generateTimeSlots(selectedDate, stylistId, serviceId);
      setTimeSlots(slots);
      setLoading(false);

      // If time was in voice command, try to select it
      if (command?.time) {
        const matchingSlot = slots.find((slot) => slot.time === command.time && slot.available);
        if (matchingSlot) {
          setSelectedTime(matchingSlot.time);
        }
      }
    }, 800);
  }, [selectedDate]);

  // Handle date selection
  const handleDateSelect = (date: DateData) => {
    setSelectedDate(date.dateString);
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle continue button
  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      router.push({
        pathname: '/screens/booking-screen',
        params: {
          serviceId,
          stylistId,
          date: selectedDate,
          time: selectedTime,
          command: command ? JSON.stringify(command) : undefined,
        },
      });
    }
  };

  // Prepare calendar marked dates
  const markedDates: any = {
    [selectedDate]: { selected: true, selectedColor: '#2196F3' },
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Select Date & Time
      </Text>

      {(command?.date || command?.time) && (
        <Card style={styles.voiceCard}>
          <Card.Content>
            <Text style={styles.voiceDetected}>Voice command detected:</Text>
            {command?.date && <Text>Date: {new Date(command.date).toLocaleDateString()}</Text>}
            {command?.time && <Text>Time: {command.time}</Text>}
          </Card.Content>
        </Card>
      )}

      <Title style={styles.dateTitle}>Select a date</Title>
      <Calendar
        current={selectedDate}
        minDate={todayStr}
        maxDate={maxDateStr}
        onDayPress={handleDateSelect}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#2196F3',
          selectedDayBackgroundColor: '#2196F3',
          textDayFontSize: 16,
        }}
      />

      <Title style={styles.timeTitle}>Available times for {formatDisplayDate(selectedDate)}</Title>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : timeSlots.length === 0 ? (
        <Text style={styles.noTimesMessage}>No available times for this date</Text>
      ) : (
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((slot) => (
            <Chip
              key={slot.id}
              selected={selectedTime === slot.time}
              disabled={!slot.available}
              onPress={() => slot.available && handleTimeSelect(slot.time)}
              style={[
                styles.timeChip,
                selectedTime === slot.time ? styles.selectedTimeChip : null,
                !slot.available ? styles.unavailableTimeChip : null,
              ]}
              textStyle={selectedTime === slot.time ? styles.selectedTimeText : null}
            >
              {slot.time}
            </Chip>
          ))}
        </View>
      )}

      <Button
        mode="contained"
        onPress={handleContinue}
        disabled={!selectedDate || !selectedTime}
        style={styles.continueButton}
      >
        Continue
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginBottom: 16,
    textAlign: 'center',
  },
  voiceCard: {
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  voiceDetected: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  timeTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  timeChip: {
    margin: 4,
    backgroundColor: '#ffffff',
  },
  selectedTimeChip: {
    backgroundColor: '#2196F3',
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  unavailableTimeChip: {
    backgroundColor: '#f0f0f0',
  },
  loader: {
    marginVertical: 24,
  },
  noTimesMessage: {
    textAlign: 'center',
    marginVertical: 24,
    fontStyle: 'italic',
  },
  continueButton: {
    marginVertical: 24,
    paddingVertical: 8,
  },
});
