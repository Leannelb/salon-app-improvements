import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';
import { serviceSelectionStyles as styles } from '../styles/stylistStyles';
import { Service } from '../types/serviceTypes';
import { serviceMockData } from '../mock-data/servicesData';
import useServices from '../hooks/useServices';
import CustomButton from '../components/customButton';

export default function ServiceSelection() {
  const { selectedService, setSelectedService, command, handleContinue } = useServices();

  const renderServiceItem = ({ item }: { item: Service }) => (
    <Card
      style={[styles.serviceCard, selectedService === item.id ? styles.selectedCard : null]}
      onPress={() => setSelectedService(item.id)}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.description}</Paragraph>
        <View style={styles.serviceDetails}>
          <Text style={styles.duration}>{item.duration} min</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Select a Service
      </Text>

      {command?.service && (
        <Text style={styles.voiceDetected}>
          Voice command detected:{' '}
          {serviceMockData.find((s) => s.id === parseInt(command.service || ''))?.name || ''}
        </Text>
      )}

      <FlatList
        data={serviceMockData}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.servicesList}
      />
      <CustomButton
        mode="contained"
        onPress={handleContinue}
        disabled={!selectedService}
        style={styles.continueButton}
        buttonText="Continue"
      />
    </View>
  );
}
