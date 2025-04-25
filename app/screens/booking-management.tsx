// screens/booking-management.tsx
import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, Card, Button, Divider, Dialog, Portal } from 'react-native-paper';
import { bookingManagementStyles as styles } from '../styles/bookingStyles';
import { Booking } from '../types/bookingTypes';
import { useBookingManagement } from '../hooks/useBooking';
import CustomButton from '../components/customButton';
import { useRouter } from 'expo-router';

const router = useRouter();

export default function BookingManagement() {
  const {
    bookings,
    selectedBooking,
    cancelDialogVisible,
    activeFilter,
    getStatusColor,
    formatDate,
    handleReschedule,
    handleCancelRequest,
    confirmCancel,
    setCancelDialogVisible,
    setActiveFilter,
  } = useBookingManagement();

  // Render a booking card
  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isPast = new Date(item.date + 'T' + item.time) < new Date();
    const canCancel = item.status === 'confirmed' && !isPast;
    const canReschedule = item.status === 'confirmed' && !isPast;

    return (
      <Card style={styles.bookingCard}>
        <Card.Content>
          <View style={styles.bookingHeader}>
            <Text variant="titleLarge">{item.serviceName}</Text>
            <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>

          <Text variant="bodyMedium" style={styles.bookingDetails}>
            {formatDate(item.date)} at {item.time}
          </Text>

          <Text variant="bodyMedium" style={styles.bookingDetails}>
            with {item.stylistName} at {item.branchName}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.bookingActions}>
            <Text variant="titleMedium" style={styles.price}>
              ${item.price}
            </Text>

            <View style={styles.actionButtons}>
              {canReschedule && (
                <Button
                  mode="text"
                  onPress={() => handleReschedule(item)}
                  icon="calendar-clock"
                  style={styles.actionButton}
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
                  style={styles.actionButton}
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

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        My Appointments
      </Text>

      <View style={styles.filtersContainer}>
        <Button mode="text" onPress={() => setActiveFilter('confirmed')}>
          Confirmed
        </Button>
        <Button
          label="All"
          isActive={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
      </View>

      {bookings.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>No appointments found</Text>
            <Button mode="contained" style={styles.newBookingButton}>
              Book New Appointment
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.bookingsList}
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
      <CustomButton
        mode="contained"
        icon="plus"
        style={styles.floatingButton}
        onPress={() => router.push('/screens/booking-assistant')}
        buttonText="Book New Appointment"
      />
    </ScrollView>
  );
}
