import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StoreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>STORE</Text>
      <View style={styles.divider} />
      <View style={styles.emptyBox}>
        <Text style={styles.emptyIcon}>🏪</Text>
        <Text style={styles.emptyText}>The store is empty.</Text>
        <Text style={styles.emptySubtext}>The merchant will arrive soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e05',
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#c9933a',
    letterSpacing: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  divider: {
    width: 160,
    height: 2,
    backgroundColor: '#c9933a',
    opacity: 0.4,
    marginTop: 12,
    marginBottom: 48,
    borderRadius: 1,
  },
  emptyBox: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a3318',
    backgroundColor: '#20130a',
    borderRadius: 4,
    paddingVertical: 40,
    paddingHorizontal: 32,
    width: '100%',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyText: {
    color: '#c8b090',
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtext: {
    color: '#7a5c35',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
