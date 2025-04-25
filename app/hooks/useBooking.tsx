import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { parseVoiceCommand, CommandResult } from '../utils/voice-command-parser';
import { Dimensions, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { Booking, BookingStatus } from '../types/bookingTypes';
import { Service } from '../types/serviceTypes';
import { Stylist } from '../types/stylistTypes';
import { mockBookings } from '../mock-data/bookingData';
import { servicesBookingMockData, stylistsMockData } from '../mock-data/servicesData';
import { mockBranches } from '../mock-data/branchData';

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

/******* BOOKING sCREEN - BOOKING LOGIC********/
export function useBookingScreen() {
  const services: Service[] = servicesBookingMockData;
  const stylists: Stylist[] = stylistsMockData;
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

  return {
    service,
    stylist,
    router,
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
  };
}

export function useBranchSelection() {
  const params = useLocalSearchParams();
  const serviceId = params.serviceId as string;
  const command = params.command ? (JSON.parse(params.command as string) as CommandResult) : null;

  // Check if branch was detected in voice command
  const detectedBranchId = command?.branch || null;
  const [selectedBranch, setSelectedBranch] = useState<string | null>(detectedBranchId);

  const handleContinue = () => {
    if (selectedBranch) {
      // Navigate to stylist selection with both service and branch
      router.push({
        pathname: '/screens/stylist-selection',
        params: {
          serviceId,
          branchId: selectedBranch,
          command: JSON.stringify(command),
        },
      });
    }
  };

  return {
    selectedBranch,
    setSelectedBranch,
    handleContinue,
    command,
    branches: mockBranches,
  };
}
