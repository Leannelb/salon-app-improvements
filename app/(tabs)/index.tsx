import React from 'react';
import { Text, View, ImageBackground, ScrollView } from 'react-native';
import { Button, Card, IconButton, Modal, Portal } from 'react-native-paper';
import VoiceRecognition from '../components/voice-recognition';
import { CommandResult } from '../utils/voice-command-parser';
import CustomButton from '../components/customButton';
import { buttonStyles } from '../styles/buttonStyles';
import { homepageStyles } from '../styles/bookingStyles';
import { useIndexHook } from '../hooks/useBooking';

export default function Index() {
  const {
    setVoiceModalVisible,
    isSmallScreen,
    voiceModalVisible,
    handleVoiceResult,
    lastCommand,
    router,
  } = useIndexHook();

  return (
    <View style={homepageStyles.container}>
      <ImageBackground
        source={require('../../assets/images/salon-bg.jpeg')}
        style={homepageStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={homepageStyles.overlay}>
          <Text style={homepageStyles.title}>Luxe Salon</Text>
          <Text style={homepageStyles.subtitle}>Experience luxury and style</Text>

          {/* Voice booking button */}
          <CustomButton
            mode="contained"
            icon="microphone"
            onPress={() => setVoiceModalVisible(true)}
            buttonText={isSmallScreen ? 'Voice' : 'Book with Voice'}
            style={buttonStyles.voiceButton}
          />

          {/* Regular booking button */}
          <CustomButton
            mode="contained"
            onPress={() => {}}
            style={[buttonStyles.regularButton, buttonStyles.marginTop]}
            buttonText="Book Now"
            link="/service-selection"
          />

          {/* Manage appointments button */}
          <CustomButton
            mode="contained"
            onPress={() => {}}
            style={[buttonStyles.manageButton, buttonStyles.marginTop]}
            buttonText={isSmallScreen ? 'Manage' : 'Manage Booking'}
            link="/screens/booking-management"
          />
        </View>
      </ImageBackground>

      {/* Voice recognition modal */}
      <Portal>
        <Modal
          visible={voiceModalVisible}
          onDismiss={() => setVoiceModalVisible(false)}
          contentContainerStyle={homepageStyles.modalContainer}
        >
          <IconButton
            icon="close"
            size={24}
            onPress={() => setVoiceModalVisible(false)}
            style={homepageStyles.closeButton}
          />

          <Text style={homepageStyles.modalTitle}>Voice Booking</Text>
          <Text style={homepageStyles.modalSubtitle}>
            Say a command like &quot;Book a haircut with Sarah tomorrow at 2pm&quot;
          </Text>

          <VoiceRecognition onResult={handleVoiceResult} />

          {lastCommand && (
            <Card style={homepageStyles.resultCard}>
              <Card.Content>
                <Text style={homepageStyles.resultTitle}>I understood:</Text>
                <ScrollView style={homepageStyles.resultScroll}>
                  <Text style={homepageStyles.resultItem}>
                    Intent: {lastCommand.intent || 'Unknown'}
                  </Text>
                  <Text style={homepageStyles.resultItem}>
                    Service: {lastCommand.service || 'Not specified'}
                  </Text>
                  <Text style={homepageStyles.resultItem}>
                    Stylist: {lastCommand.stylist || 'Not specified'}
                  </Text>
                  <Text style={homepageStyles.resultItem}>
                    Date: {lastCommand.date?.toDateString() || 'Not specified'}
                  </Text>
                  <Text style={homepageStyles.resultItem}>
                    Time: {lastCommand.time || 'Not specified'}
                  </Text>
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
            style={homepageStyles.modalButton}
          >
            Continue to Booking
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}
