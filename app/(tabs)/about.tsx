import { Text, View } from 'react-native';
import { aboutStyles } from '../styles/aboutStyles';

export default function AboutScreen() {
  return (
    <View style={aboutStyles.container}>
      <Text style={aboutStyles.text}>Luxe Salon</Text>
    </View>
  );
}
