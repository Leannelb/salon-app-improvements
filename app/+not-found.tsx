import React from 'react';
import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { notFoundStyles as styles } from './styles/notFound';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}
