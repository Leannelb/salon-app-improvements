import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { parseVoiceCommand, CommandResult } from '../utils/voice-command-parser';
import { Dimensions, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { Booking, BookingStatus } from '../types/bookingTypes';
import { mockBookings } from '../mock-data/bookingData';
// Add global setTimeout type
declare const setTimeout: (callback: () => void, ms: number) => number;

const router = useRouter();

export function useBooking() {
  const [lastCommand, setLastCommand] = useState<CommandResult | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

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

/******* BOOKING MANAGEMENT - BOOKING LOGIC********/
// Will I continue to add the booking logic here or move it to a new hook useBookingManagement
export function useBookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<BookingStatus | 'all'>('all');

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle voice commands for bookings
  const handleVoiceCommand = () => {
    Speech.speak('Please say cancel or reschedule followed by your appointment date.', {
      onDone: () => {
        // In a real app, we would listen for the command here
        // For demo purposes, we'll just use a timeout to simulate voice recognition
        setTimeout(() => {
          Alert.alert('Voice Command Recognized', 'Reschedule my appointment on March 15th', [
            {
              text: 'Process Command',
              onPress: () => {
                const booking = bookings.find((b) => b.date === '2025-03-15');
                if (booking) {
                  handleReschedule(booking);
                }
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]);
        }, 2000);
      },
    });
  };

  // Handle rescheduling
  const handleReschedule = (booking: Booking) => {
    // Navigate to reschedule assistant with booking data
    router.push({
      pathname: '/screens/reschedule-assistant',
      params: { bookingId: booking.id },
    });
  };

  // Handle cancellation request
  const handleCancelRequest = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogVisible(true);
  };

  // Confirm cancellation
  const confirmCancel = () => {
    if (selectedBooking) {
      // Provide feedback with voice
      Speech.speak(
        `Your ${selectedBooking.serviceName} appointment on ${formatDate(selectedBooking.date)} has been cancelled.`,
      );

      // Update booking status to cancelled
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: 'cancelled' as BookingStatus }
            : booking,
        ),
      );

      // Close dialog
      setCancelDialogVisible(false);
      setSelectedBooking(null);

      // Show success message
      Alert.alert('Cancelled', 'Your appointment has been cancelled.');
    }
  };

  // Get appropriate color for status
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const filteredBookings =
    activeFilter === 'all'
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  return {
    bookings: filteredBookings,
    selectedBooking,
    cancelDialogVisible,
    activeFilter,
    getStatusColor,
    formatDate,
    handleReschedule,
    handleCancelRequest,
    handleVoiceCommand,
    confirmCancel,
    setCancelDialogVisible,
    setActiveFilter,
  };
}
