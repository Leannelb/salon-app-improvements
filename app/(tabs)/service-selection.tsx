import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';
import { CommandResult } from '../utils/voice-command-parser';
import { router, useLocalSearchParams } from 'expo-router';
import { serviceSelectionStyles as styles } from '../styles/stylistStyles';
// Service type definition
type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
};

// Mock services data
const services: Service[] = [
  {
    id: '1',
    name: 'Haircut',
    duration: 30,
    price: 35,
    description: 'Professional haircut tailored to your style preferences',
  },
  {
    id: '2',
    name: 'Coloring',
    duration: 90,
    price: 80,
    description: 'Full color treatment including roots and styling',
  },
  {
    id: '3',
    name: 'Styling',
    duration: 45,
    price: 50,
    description: 'Expert styling for special occasions or everyday looks',
  },
];

export default function ServiceSelection() {
  const params = useLocalSearchParams();
  const command = params?.command ? (JSON.parse(params.command as string) as CommandResult) : null;
  const [selectedService, setSelectedService] = useState<string | null>(command?.service || null);

  const handleContinue = () => {
    if (selectedService) {
      router.push({
        pathname: '/screens/branch-selection', // Changed from stylist-selection
        params: {
          serviceId: selectedService,
          command: JSON.stringify(command),
        },
      });
    }
  };

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
          Voice command detected: {services.find((s) => s.id === command.service)?.name}
        </Text>
      )}

      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesList}
      />

      <Button
        mode="contained"
        onPress={handleContinue}
        disabled={!selectedService}
        style={styles.continueButton}
      >
        Continue
      </Button>
    </View>
  );
}

