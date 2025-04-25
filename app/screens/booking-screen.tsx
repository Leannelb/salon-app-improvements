import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, Title, Divider, HelperText } from 'react-native-paper';
import { bookingScreenStyles as styles } from '../styles/bookingStyles';
import { useBookingScreen } from '../hooks/useBooking';

export default function BookingConfirmation() {
  const {
    service,
    stylist,
    formatDisplayDate,
    time,
    date,
    name,
    handleNameChange,
    nameError,
    email,
    handleEmailChange,
    emailError,
    phone,
    handlePhoneChange,
    phoneError,
    cardNumber,
    handleCardNumberChange,
    cardNumberError,
    cardExpiry,
    handleExpiryChange,
    cardExpiryError,
    cardCvc,
    handleCvcChange,
    cardCvcError,
    isFormValid,
    handleConfirm,
    processing,
  } = useBookingScreen();

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Booking Summary
      </Text>

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Appointment Details</Title>
          <Text style={styles.detailText}>Service: {service?.name}</Text>
          <Text style={styles.detailText}>Stylist: {stylist?.name}</Text>
          <Text style={styles.detailText}>Date: {formatDisplayDate(date)}</Text>
          <Text style={styles.detailText}>Time: {time}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.priceText}>Price: ${service?.price.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.formCard}>
        <Card.Content>
          <Title>Your Information</Title>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={handleNameChange}
            mode="outlined"
            style={styles.input}
            error={!!nameError}
          />
          {nameError ? <HelperText type="error">{nameError}</HelperText> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            error={!!emailError}
          />
          {emailError ? <HelperText type="error">{emailError}</HelperText> : null}

          <TextInput
            label="Phone"
            value={phone}
            onChangeText={handlePhoneChange}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            error={!!phoneError}
          />
          {phoneError ? <HelperText type="error">{phoneError}</HelperText> : null}
        </Card.Content>
      </Card>

      <Card style={styles.formCard}>
        <Card.Content>
          <Title>Payment Details</Title>

          <TextInput
            label="Card Number"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            mode="outlined"
            keyboardType="number-pad"
            style={styles.input}
            maxLength={19} // 16 digits + 3 spaces
            error={!!cardNumberError}
          />
          {cardNumberError ? <HelperText type="error">{cardNumberError}</HelperText> : null}

          <View style={styles.cardRowContainer}>
            <View style={[styles.cardRowInput, { marginRight: 8 }]}>
              <TextInput
                label="Expiry (MM/YY)"
                value={cardExpiry}
                onChangeText={handleExpiryChange}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
                maxLength={5} // MM/YY
                error={!!cardExpiryError}
              />
              {cardExpiryError ? <HelperText type="error">{cardExpiryError}</HelperText> : null}
            </View>

            <View style={styles.cardRowInput}>
              <TextInput
                label="CVC"
                value={cardCvc}
                onChangeText={handleCvcChange}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
                maxLength={3}
                secureTextEntry
                error={!!cardCvcError}
              />
              {cardCvcError ? <HelperText type="error">{cardCvcError}</HelperText> : null}
            </View>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleConfirm}
        loading={processing}
        disabled={processing || !isFormValid}
        style={styles.confirmButton}
      >
        {processing ? 'Processing...' : 'Confirm Booking'}
      </Button>
    </ScrollView>
  );
}
