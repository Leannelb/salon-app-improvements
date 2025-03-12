import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native'; // ui elements
import { Text, Card, Button, Title, Chip } from 'react-native-paper'; //ui elements
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CommandResult } from '../utils/voice-command-parser';

// Type definitions
type Stylist = {
  id: string;
  name: string;
  specialties: string[];
  imageUrl?: string;
  experience?: string;
  branches: string[];
};

type Service = {
  id: string;
  name: string;
};

// Mock data
const services: Service[] = [
  { id: '1', name: 'Haircut' },
  { id: '2', name: 'Coloring' },
  { id: '3', name: 'Styling' },
];

const stylists: Stylist[] = [
  {
    id: '1',
    name: 'John',
    specialties: ['1', '3'],
    branches: ['southside', 'northside'],
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    experience: '6 years',
  },
  {
    id: '2',
    name: 'Sarah',
    specialties: ['1', '2', '3'],
    branches: ['southside', 'northside'],
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    experience: '8 years',
  },
  {
    id: '3',
    name: 'Michael',
    specialties: ['1'],
    branches: ['downtown'],
    imageUrl: 'https://randomuser.me/api/portraits/men/68.jpg',
    experience: '4 years',
  },
  {
    id: '4',
    name: 'Jessica',
    specialties: ['2', '3'],
    branches: ['northside'],
    imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    experience: '7 years',
  },
];

export default function StylistSelection() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = params.serviceId as string;
  const branchId = params.branchId as string;
  const command = params.command ? (JSON.parse(params.command as string) as CommandResult) : null;
  const [selectedStylist, setSelectedStylist] = useState<string | null>(command?.stylist || null);
  const [availableStylists, setAvailableStylists] = useState<Stylist[]>([]);

  useEffect(() => {
    // Filter stylists who can perform this service AND work at this branch
    const filtered = stylists.filter(
      (stylist) => stylist.specialties.includes(serviceId) && stylist.branches.includes(branchId),
    );
    setAvailableStylists(filtered);

    // If pre-selected stylist can't do this service, clear selection
    if (selectedStylist) {
      const stylist = stylists.find((s) => s.id === selectedStylist);
      if (!stylist || !stylist.specialties.includes(serviceId)) {
        setSelectedStylist(null);
      }
    }
  }, [serviceId, branchId]);

  const handleContinue = () => {
    router.push({
      pathname: '/screens/date-time-selection',
      params: {
        serviceId,
        stylistId: selectedStylist || 'any',
        branchId,
        command: command ? JSON.stringify(command) : undefined,
      },
    });
  };

  const getServiceNameById = (id: string): string => {
    const service = services.find((s) => s.id === id);
    return service ? service.name : '';
  };

  const renderStylistItem = ({ item }: { item: Stylist }) => (
    <Card
      style={[styles.stylistCard, selectedStylist === item.id ? styles.selectedCard : null]}
      onPress={() => setSelectedStylist(item.id)}
    >
      <Card.Content style={styles.stylistContent}>
        {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.stylistImage} />}
        <View style={styles.stylistInfo}>
          <Title>{item.name}</Title>
          {item.experience && <Text style={styles.experience}>{item.experience} experience</Text>}
          <View style={styles.specialtiesContainer}>
            {item.specialties.map((specialty) => (
              <Chip key={specialty} style={styles.specialtyChip}>
                {getServiceNameById(specialty)}
              </Chip>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const selectedService = services.find((s) => s.id === serviceId);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Choose Your Stylist
      </Text>

      <Text variant="bodyMedium" style={styles.subheading}>
        For: {selectedService?.name || 'Selected service'}
      </Text>

      {command?.stylist && (
        <Text style={styles.voiceDetected}>
          Voice command detected: {stylists.find((s) => s.id === command.stylist)?.name}
        </Text>
      )}

      <FlatList
        data={availableStylists}
        renderItem={renderStylistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.stylistsList}
      />

      <View style={styles.buttonsContainer}>
        <Button mode="outlined" onPress={() => setSelectedStylist(null)} style={styles.anyButton}>
          Any Available Stylist
        </Button>

        <Button mode="contained" onPress={handleContinue} style={styles.continueButton}>
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  voiceDetected: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  stylistsList: {
    paddingBottom: 16,
  },
  stylistCard: {
    marginBottom: 12,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  stylistContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stylistImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  stylistInfo: {
    flex: 1,
  },
  experience: {
    color: '#666',
    marginBottom: 8,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  specialtyChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  buttonsContainer: {
    marginTop: 16,
  },
  anyButton: {
    marginBottom: 12,
  },
  continueButton: {
    paddingVertical: 8,
  },
});
