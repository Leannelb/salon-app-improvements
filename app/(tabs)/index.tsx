// index.tsx - Improved Home Page with Voice Recognition
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button, Card, IconButton, Modal, Portal } from 'react-native-paper';
import VoiceRecognition from '../components/voice-recognition';
import { parseVoiceCommand, CommandResult } from '../utils/voice-command-parser';
import { Dimensions } from 'react-native';

export default function Index() {
  const [lastCommand, setLastCommand] = useState<CommandResult | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const router = useRouter();
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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/salon-bg.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Luxe Salon</Text>
          <Text style={styles.subtitle}>Experience luxury and style</Text>

          {/* Voice booking button */}
          <Button
            mode="contained"
            icon="microphone"
            onPress={() => setVoiceModalVisible(true)}
            style={[styles.bookButton, styles.voiceButton]}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            {isSmallScreen ? 'Voice' : 'Book with Voice'}
          </Button>

          {/* Regular booking button */}
          <Button
            mode="contained"
            onPress={() => {}}
            style={[styles.bookButton, styles.marginTop]}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            <Link href="/service-selection" style={styles.buttonText}>
              Book Now
            </Link>
          </Button>

          {/* Manage appointments button */}
          <Button
            mode="contained"
            onPress={() => {}}
            style={[styles.bookButton, styles.marginTop, styles.manageButton]}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            <Link href="/screens/booking-management" style={styles.buttonText}>
              {isSmallScreen ? 'Manage' : 'Manage Booking'}
            </Link>
          </Button>
        </View>
      </ImageBackground>

      {/* Voice recognition modal */}
      <Portal>
        <Modal
          visible={voiceModalVisible}
          onDismiss={() => setVoiceModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <IconButton
            icon="close"
            size={24}
            onPress={() => setVoiceModalVisible(false)}
            style={styles.closeButton}
          />

          <Text style={styles.modalTitle}>Voice Booking</Text>
          <Text style={styles.modalSubtitle}>
            Say a command like &quot;Book a haircut with Sarah tomorrow at 2pm&quot;
          </Text>

          <VoiceRecognition onResult={handleVoiceResult} />

          {lastCommand && (
            <Card style={styles.resultCard}>
              <Card.Content>
                <Text style={styles.resultTitle}>I understood:</Text>
                <ScrollView style={styles.resultScroll}>
                  <Text style={styles.resultItem}>Intent: {lastCommand.intent || 'Unknown'}</Text>
                  <Text style={styles.resultItem}>
                    Service: {lastCommand.service || 'Not specified'}
                  </Text>
                  <Text style={styles.resultItem}>
                    Stylist: {lastCommand.stylist || 'Not specified'}
                  </Text>
                  <Text style={styles.resultItem}>
                    Date: {lastCommand.date?.toDateString() || 'Not specified'}
                  </Text>
                  <Text style={styles.resultItem}>Time: {lastCommand.time || 'Not specified'}</Text>
                </ScrollView>
              </Card.Content>
            </Card>
          )}

          <Button
            mode="contained"
            onPress={() => {
              setVoiceModalVisible(false);
              router.push({
                pathname: '/service-selection',
                params: {
                  command: lastCommand
                    ? JSON.stringify(lastCommand)
                    : JSON.stringify({} as CommandResult),
                },
              });
            }}
            style={styles.modalButton}
          >
            Continue to Booking
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  bookButton: {
    paddingHorizontal: 32,
    borderRadius: 25,
    backgroundColor: '#6A1B9A', // Medium purple
    width: '80%',
    maxWidth: 300,
  },
  voiceButton: {
    backgroundColor: '#9C27B0',
  },
  manageButton: {
    backgroundColor: '#4A148C', // Deep purple
  },
  marginTop: {
    marginTop: 16,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  resultCard: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#e3f2fd',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultScroll: {
    maxHeight: 150,
  },
  resultItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalButton: {
    marginTop: 20,
    width: '100%',
  },
});
