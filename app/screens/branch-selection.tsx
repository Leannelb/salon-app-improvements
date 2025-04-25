// screens/branch-selection.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, Card, Button, Title, Paragraph, Chip } from 'react-native-paper';
import { branchStyles as styles } from '../styles/branchStyles';
import { Branch } from '../types/branchTypes';
import { useBranchSelection } from '../hooks/useBooking';

export default function BranchSelection() {
  const { selectedBranch, setSelectedBranch, handleContinue, branches, command } =
    useBranchSelection();

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
