import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * TabLayout is the main navigation component that sets up the bottom tab navigation
 * for the application using Expo Router's Tabs component.
 *
 * @returns {JSX.Element} A Tabs navigator component with configured screens for:
 *   - Home (index)
 *   - Booking
 *   - Services (service-selection)
 *   - About
 *
 * Each tab is configured with:
 *   - Custom icons using Ionicons
 *   - Active/inactive states
 *   - Custom color scheme (purple: #6A1B9A)
 *   - Hidden header
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6A1B9A',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="service-selection"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'ribbon' : 'ribbon-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
