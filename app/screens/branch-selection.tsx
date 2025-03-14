// screens/branch-selection.tsx
import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Card, Button, Title, Paragraph, Chip } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CommandResult } from '../utils/voice-command-parser';
import { branchStyles as styles } from '../styles/branchStyles';

// Branch type definition
type Branch = {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  phone: string;
  distance?: string; // Distance from user if location permissions granted
  features?: string[]; // Special features or services at this branch
};

// Mock branches data
const branches: Branch[] = [
  {
    id: 'southside',
    name: 'Southside Salon',
    address: '18 South Anne Street, Dublin',
    imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500',
    phone: '(01) 847-3492',
    distance: '1.2 miles',
    features: ['Parking Available', 'Wheelchair Accessible'],
  },
  {
    id: 'northside',
    name: 'Northside Studio',
    address: '87 Cromcastle Road, Northside',
    imageUrl: 'https://images.unsplash.com/photo-1470259078422-826894b933aa?w=500',
    phone: '(01) 824-6578',
    distance: '3.5 miles',
    features: ['Wi-Fi', 'Coffee Bar'],
  },
];

export default function BranchSelection() {
  const router = useRouter();
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

  const renderBranchItem = ({ item }: { item: Branch }) => (
    <Card
      style={[styles.branchCard, selectedBranch === item.id ? styles.selectedCard : null]}
      onPress={() => setSelectedBranch(item.id)}
    >
      {item.imageUrl && <Card.Cover source={{ uri: item.imageUrl }} style={styles.cardImage} />}
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph style={styles.address}>{item.address}</Paragraph>
        <Text style={styles.phone}>{item.phone}</Text>
        {item.distance && <Text style={styles.distance}>{item.distance} away</Text>}

        <View style={styles.featuresContainer}>
          {item.features?.map((feature) => (
            <Chip key={feature} style={styles.featureChip}>
              {feature}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Select Location
      </Text>

      {command?.branch && (
        <Text style={styles.voiceDetected}>
          Voice command detected: {branches.find((b) => b.id === command.branch)?.name}
        </Text>
      )}

      <FlatList
        data={branches}
        renderItem={renderBranchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.branchesList}
      />

      <Button
        mode="contained"
        onPress={handleContinue}
        disabled={!selectedBranch}
        style={styles.continueButton}
      >
        Continue
      </Button>
    </View>
  );
}
