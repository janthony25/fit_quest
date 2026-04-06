import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { user, character } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>
      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>{user?.email}</Text>
          </View>
          {character && (
            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowLabel}>Character</Text>
              <Text style={styles.rowValue}>{character.name}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => supabase.auth.signOut()}
        activeOpacity={0.75}
      >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e05',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#c9933a',
    letterSpacing: 4,
    textAlign: 'center',
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
    marginBottom: 32,
    borderRadius: 1,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#20130a',
    borderWidth: 1,
    borderColor: '#4a3318',
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#2e1a06',
  },
  rowLabel: {
    color: '#9a7a50',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  rowValue: {
    color: '#c8b090',
    fontSize: 13,
    maxWidth: '60%',
    textAlign: 'right',
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: '#c0392b',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 'auto',
    marginBottom: 8,
  },
  logoutText: {
    color: '#c0392b',
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: '800',
  },
});
