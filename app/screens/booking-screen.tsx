import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, Title, Divider, HelperText } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CommandResult } from '../utils/voice-command-parser';
import { bookingScreenStyles as styles } from '../styles/bookingStyles';

// Mock data for services and stylists
const services = [
  { id: '1', name: 'Haircut', price: 35 },
  { id: '2', name: 'Coloring', price: 80 },
  { id: '3', name: 'Styling', price: 50 },
];

const stylists = [
  { id: '1', name: 'John' },
  { id: '2', name: 'Sarah' },
  { id: '3', name: 'Michael' },
  { id: '4', name: 'Jessica' },
  { id: 'any', name: 'Any Available Stylist' },
];

export default function BookingConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const serviceId = params.serviceId as string;
  const stylistId = params.stylistId as string;
  const date = params.date as string;
  const time = params.time as string;
  const command = params.command ? (JSON.parse(params.command as string) as CommandResult) : null;

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);

  // Validation states
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [cardNumberError, setCardNumberError] = useState<string>('');
  const [cardExpiryError, setCardExpiryError] = useState<string>('');
  const [cardCvcError, setCardCvcError] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Find service and stylist details
  const service = services.find((s) => s.id === serviceId);
  const stylist = stylists.find((s) => s.id === stylistId);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format credit card number with spaces every 4 digits
  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const digitsOnly = text.replace(/\D/g, '');

    // Add spaces after every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');

    return formatted;
  };

  // Handle card number change
  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);

    // Validate card number
    if (formatted.replace(/\s/g, '').length < 16) {
      setCardNumberError('Card number must be 16 digits');
    } else {
      setCardNumberError('');
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const digitsOnly = text.replace(/\D/g, '');

    if (digitsOnly.length > 2) {
      return digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2, 4);
    }

    return digitsOnly;
  };

  // Handle expiry date change
  const handleExpiryChange = (text: string) => {
    // Remove any existing slash first
    const textWithoutSlash = text.replace('/', '');

    const formatted = formatExpiryDate(textWithoutSlash);
    setCardExpiry(formatted);

    // Validate expiry date
    validateExpiryDate(formatted);
  };

  // Validate expiry date
  const validateExpiryDate = (expiry: string) => {
    if (!expiry || expiry.length < 5) {
      setCardExpiryError('Invalid expiry date');
      return;
    }

    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt('20' + yearStr, 10); // Assuming 20xx

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      setCardExpiryError('Invalid month');
      return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setCardExpiryError('Card has expired');
    } else {
      setCardExpiryError('');
    }
  };

  // Handle CVC change
  const handleCvcChange = (text: string) => {
    // Only allow digits
    const digitsOnly = text.replace(/\D/g, '');
    setCardCvc(digitsOnly);

    if (digitsOnly.length < 3) {
      setCardCvcError('CVC must be 3 digits');
    } else {
      setCardCvcError('');
    }
  };

  // Handle name change
  const handleNameChange = (text: string) => {
    setName(text);

    if (!text.trim()) {
      setNameError('Name is required');
    } else {
      setNameError('');
    }
  };

  // Handle email change
  const handleEmailChange = (text: string) => {
    setEmail(text);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  // Handle phone change
  const handlePhoneChange = (text: string) => {
    setPhone(text);

    if (!text.trim()) {
      setPhoneError('Phone number is required');
    } else if (!/^\d{10,}$/.test(text.replace(/\D/g, ''))) {
      setPhoneError('Please enter a valid phone number');
    } else {
      setPhoneError('');
    }
  };

  // Check if form is valid
  useEffect(() => {
    const isValid =
      !nameError &&
      name.trim() !== '' &&
      !emailError &&
      email.trim() !== '' &&
      !phoneError &&
      phone.trim() !== '' &&
      !cardNumberError &&
      cardNumber.replace(/\s/g, '').length === 16 &&
      !cardExpiryError &&
      cardExpiry.length === 5 &&
      !cardCvcError &&
      cardCvc.length === 3;

    setIsFormValid(isValid);
  }, [
    name,
    nameError,
    email,
    emailError,
    phone,
    phoneError,
    cardNumber,
    cardNumberError,
    cardExpiry,
    cardExpiryError,
    cardCvc,
    cardCvcError,
  ]);

  // Handle confirmation
  const handleConfirm = () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please correct the errors in the form');
      return;
    }

    setProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      router.push('/screens/booking-complete');
    }, 1500);
  };

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

