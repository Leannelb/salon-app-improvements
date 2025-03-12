import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Define valid route paths
type AppRoute =
  | '/'
  | '/service-selection'
  | '/screens/branch-selection'
  | '/screens/booking-screen'
  | '/screens/stylist-selection'
  | '/screens/date-time-selection'
  | '/screens/booking-management'
  | '/screens/reschedule-assistant'
  | '/(tabs)/about';

// Define valid Ionicons names for our menu
type MenuIcon =
  | 'home-outline'
  | 'calendar-outline'
  | 'business-outline'
  | 'person-outline'
  | 'time-outline'
  | 'calendar-number-outline'
  | 'sync-outline'
  | 'information-circle-outline'
  | 'menu-outline'
  | 'close-outline';

interface MenuItem {
  id: string;
  title: string;
  icon: MenuIcon;
  route: AppRoute;
}

// Menu items - updated with all your navigation options
const menuItems: MenuItem[] = [
  { id: 'home', title: 'Home', icon: 'home-outline', route: '/' },
  {
    id: 'book',
    title: 'Book New Appointment',
    icon: 'calendar-outline',
    route: '/service-selection',
  },
  {
    id: 'branch',
    title: 'Select Branch',
    icon: 'business-outline',
    route: '/screens/branch-selection',
  },
  {
    id: 'stylist',
    title: 'Select Stylist',
    icon: 'person-outline',
    route: '/screens/stylist-selection',
  },
  {
    id: 'datetime',
    title: 'Select Date & Time',
    icon: 'time-outline',
    route: '/screens/date-time-selection',
  },
  {
    id: 'appointments',
    title: 'My Appointments',
    icon: 'calendar-number-outline',
    route: '/screens/booking-management',
  },
  {
    id: 'reschedule',
    title: 'Reschedule Appointment',
    icon: 'sync-outline',
    route: '/screens/reschedule-assistant',
  },
  { id: 'about', title: 'About', icon: 'information-circle-outline', route: '/(tabs)/about' },
];

// Helper function to get title from path
function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || '';

  // Check for special cases
  if (lastSegment === 'index') return 'Home';
  if (lastSegment === 'booking') return 'Booking';
  if (lastSegment === 'service-selection') return 'Select Service';
  if (lastSegment === 'stylist-selection') return 'Select Stylist';
  if (lastSegment === 'branch-selection') return 'Select Branch';
  if (lastSegment === 'booking-screen') return 'Create an Appointment';
  if (lastSegment === 'date-time-selection') return 'Select Date & Time';
  if (lastSegment === 'booking-confirmation') return 'Confirm Booking';
  if (lastSegment === 'booking-complete') return 'Appointment Confirmation';
  if (lastSegment === 'booking-management') return 'My Appointments';
  if (lastSegment === 'reschedule-assistant') return 'Reschedule';
  if (lastSegment === 'about') return 'About';

  // Default formatting for other pages
  return lastSegment
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface HeaderProps {
  route: any; // Replace with specific route type if available from expo-router
  options: {
    title?: string;
    [key: string]: any;
  };
}

// Custom header component with breadcrumb navigation
function CustomHeader({ route, options }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);

  // Get page title from options or generate from path
  const title = options.title || getPageTitle(pathname);

  // Create breadcrumb path
  const getPathSegments = (path: string) => {
    // Skip tabs in the breadcrumb display
    const cleanPath = path.replace('/(tabs)', '');
    const segments = cleanPath.split('/').filter(Boolean);

    if (segments.length === 0) {
      return [{ name: 'Home', path: '/' }];
    }

    return [
      { name: 'Home', path: '/' },
      ...segments.map((segment: string, index: number) => {
        const segmentPath = '/' + segments.slice(0, index + 1).join('/');
        return {
          name: getPageTitle('/' + segment),
          path: segmentPath,
        };
      }),
    ];
  };

  const pathSegments = getPathSegments(pathname);
  const isHomePage = pathSegments.length === 1;

  // Handle menu item selection
  const handleMenuItemPress = (item: MenuItem) => {
    setMenuVisible(false);
    router.push(item.route);
  };

  // Render menu item
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress(item)}>
      <Ionicons name={item.icon} size={24} color="#6A1B9A" style={styles.menuItemIcon} />
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.headerContainer}>
      {/* Home button */}
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
        <Ionicons name="home-outline" size={24} color="#6A1B9A" />
      </TouchableOpacity>

      {/* Breadcrumb navigation */}
      <View style={styles.breadcrumbContainer}>
        {/* For home page, just show "Home Icon" */}
        {isHomePage ? (
          <Text style={styles.pageTitle}></Text>
        ) : (
          // For other pages, show breadcrumb
          <View style={styles.breadcrumb}>
            {/* Show just the last segment with "Home_Icon >" prefix */}
            <Text style={styles.breadcrumbText}>&gt; </Text>
            <Text style={styles.pageTitle}>{pathSegments[pathSegments.length - 1].name}</Text>
          </View>
        )}
      </View>

      {/* Hamburger menu button */}
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu-outline" size={28} color="#6A1B9A" />
      </TouchableOpacity>

      {/* Menu modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>Menu</Text>
                  <TouchableOpacity onPress={() => setMenuVisible(false)}>
                    <Ionicons name="close-outline" size={28} color="#333" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={menuItems}
                  renderItem={renderMenuItem}
                  keyExtractor={(item) => item.id}
                  style={styles.menuList}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        {/* Apply custom header to tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            header: (props) => <CustomHeader {...props} />,
          }}
        />

        {/* All other screens use our custom header */}
        <Stack.Screen
          name="service-selection"
          options={{
            title: 'Select Service',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="screens/stylist-selection"
          options={{
            title: 'Select Stylist',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="screens/branch-selection"
          options={{
            title: 'Select Branch',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="screens/date-time-selection"
          options={{
            title: 'Select Date & Time',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="screens/booking-screen"
          options={{
            title: 'Create an Appointment',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="screens/booking-confirmation"
          options={{
            title: 'Confirm Booking',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="screens/booking-complete"
          options={{
            title: 'Booking Confirmed',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="screens/booking-management"
          options={{
            title: 'My Appointments',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="screens/reschedule-assistant"
          options={{
            title: 'Reschedule',
            header: (props) => <CustomHeader {...props} />,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 60,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  homeButton: {
    padding: 8,
    marginRight: 8,
  },
  breadcrumbContainer: {
    flex: 1,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 16,
    color: '#6A1B9A',
  },
  pageTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: 'white',
    width: '80%',
    maxWidth: 300,
    height: '100%',
    alignSelf: 'flex-end',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});
