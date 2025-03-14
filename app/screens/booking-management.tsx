// screens/booking-management.tsx
import React, { useState } from 'react';
import { View, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Card, Button, Divider, Dialog, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { bookingManagementStyles } from '../styles/bookingStyles';

// Types for bookings
type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

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
  status: BookingStatus;
  price: number;
};

// Mock bookings data
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

export default function BookingManagement() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
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

  // Render a booking card
  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isPast = new Date(item.date + 'T' + item.time) < new Date();
    const canCancel = item.status === 'confirmed' && !isPast;
    const canReschedule = item.status === 'confirmed' && !isPast;

    return (
      <Card style={bookingManagementStyles.bookingCard}>
        <Card.Content>
          <View style={bookingManagementStyles.bookingHeader}>
            <Text variant="titleLarge">{item.serviceName}</Text>
            <Text style={[bookingManagementStyles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>

          <Text variant="bodyMedium" style={bookingManagementStyles.bookingDetails}>
            {formatDate(item.date)} at {item.time}
          </Text>

          <Text variant="bodyMedium" style={bookingManagementStyles.bookingDetails}>
            with {item.stylistName} at {item.branchName}
          </Text>

          <Divider style={bookingManagementStyles.divider} />

          <View style={bookingManagementStyles.bookingActions}>
            <Text variant="titleMedium" style={bookingManagementStyles.price}>
              ${item.price}
            </Text>

            <View style={bookingManagementStyles.actionButtons}>
              {canReschedule && (
                <Button
                  mode="text"
                  onPress={() => handleReschedule(item)}
                  icon="calendar-clock"
                  style={bookingManagementStyles.actionButton}
                >
                  Reschedule
                </Button>
              )}

              {canCancel && (
                <Button
                  mode="text"
                  onPress={() => handleCancelRequest(item)}
                  icon="calendar-remove"
                  textColor="#F44336"
                  style={bookingManagementStyles.actionButton}
                >
                  Cancel
                </Button>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Filter button component
  const FilterButton = ({
    label,
    isActive,
    onPress,
  }: {
    label: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <Button
      mode={isActive ? 'contained' : 'outlined'}
      onPress={onPress}
      style={bookingManagementStyles.filterButton}
    >
      {label}
    </Button>
  );

  // Filter bookings based on active filter
  const filteredBookings =
    activeFilter === 'all'
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  return (
    <ScrollView style={bookingManagementStyles.container}>
      <Text variant="headlineMedium" style={bookingManagementStyles.heading}>
        My Appointments
      </Text>

      <Card style={bookingManagementStyles.card}>
        <Card.Content>
          <Text variant="titleMedium">No appointments scheduled</Text>
          <Text variant="bodyMedium">Book your first appointment today!</Text>
        </Card.Content>
      </Card>

      <View style={bookingManagementStyles.filtersContainer}>
        <FilterButton
          label="Confirmed"
          isActive={activeFilter === 'confirmed'}
          onPress={() => setActiveFilter('confirmed')}
        />
        {/* <FilterButton
          label="Completed"
          isActive={activeFilter === 'completed'}
          onPress={() => setActiveFilter('completed')}
        />
        <FilterButton
          label="Cancelled"
          isActive={activeFilter === 'cancelled'}
          onPress={() => setActiveFilter('cancelled')}
        /> */}
        <FilterButton
          label="All"
          isActive={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
      </View>

      {filteredBookings.length === 0 ? (
        <Card style={bookingManagementStyles.emptyCard}>
          <Card.Content>
            <Text style={bookingManagementStyles.emptyText}>No appointments found</Text>
            <Button
              mode="contained"
              onPress={() => router.push('/booking')}
              style={bookingManagementStyles.newBookingButton}
            >
              Book New Appointment
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={bookingManagementStyles.bookingsList}
        />
      )}

      <Portal>
        <Dialog visible={cancelDialogVisible} onDismiss={() => setCancelDialogVisible(false)}>
          <Dialog.Title>Cancel Appointment</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to cancel your {selectedBooking?.serviceName} appointment on{' '}
              {selectedBooking && formatDate(selectedBooking.date)} at {selectedBooking?.time}?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelDialogVisible(false)}>No, Keep It</Button>
            <Button onPress={confirmCancel} textColor="#F44336">
              Yes, Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Button
        mode="contained"
        icon="plus"
        onPress={() => router.push('/booking')}
        style={bookingManagementStyles.floatingButton}
      >
        Book New Appointment
      </Button>
    </ScrollView>
  );
}

